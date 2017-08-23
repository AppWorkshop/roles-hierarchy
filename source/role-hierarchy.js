const winston = require('winston');
process.env.SUPPRESS_NO_CONFIG_WARNING = 'y';
const config = require('config');
const TreeModel = require('tree-model');
const topiary = require('topiary');
const _ = require('underscore');

const _GLOBAL_GROUP = "__global_roles__";

class RoleHierarchy {

  /**
   * create a new instance of RoleHierarchy
   * @param {Object} paramsObj containing a rolesHierarchy and a loggingConfig (optional) and a TreeModel config (optional):
   * {
   *   rolesHierarchy: {"name":"teacher", "subordinates": [ {"name":"student"} ]},
   *   treeModelConfig: { "childrenPropertyName": "subordinates" },
   *   loggingConfig: { "level": "debug"}
   * }
   */
  constructor(paramsObj) {

    // set up config defaults
    let loggingConfig = paramsObj.loggingConfig || {
      "level": "debug",
      "timestamp": true,
      "colorize": true
    };

    let treeModelConfig = paramsObj.treeModelConfig || { "childrenPropertyName": "subordinates" };

    this.logger = new (winston.Logger)({
      transports: [
        new (winston.transports.Console)(loggingConfig)
      ]
    });

    // actual constructor stuff here.

    // get treeModelConfig from config
    // we need a clone of the treeModelConfig (it doesn't work straight from node-config)
    treeModelConfig = JSON.parse(JSON.stringify(treeModelConfig));
    this.treeModel = new TreeModel(treeModelConfig);
    this.root = this.treeModel.parse(paramsObj.rolesHierarchy);
    this.logger.debug(this.getTopiaryAsString(this.root.model));
  }

  /**
   * re-create the hierarchy with a new object structure.
   * @param {Object} rolesHierarchy 
   */
  reparse(rolesHierarchy) {
    this.root = this.treeModel.parse(rolesHierarchy);
  }

  _findNode(roleName, startNode = this.root) {
    return startNode.first({ strategy: 'breadth' }, function (node) {
      return node.model.name === roleName;
    });
  }

  _getOrganizationsForUser(myUserObj) {
    let myOrganizations = [];
    if (myUserObj) {
      // figure out which organizations we belong to.
      if (myUserObj.profile && (myUserObj.profile.organization || myUserObj.profile.organizations)) { // note the plural
        if (myUserObj.profile.organization) { // there can be only one.
          myOrganizations = [myUserObj.profile.organization];
        } else { // this guy is in multiple organizations.
          myOrganizations = JSON.parse(JSON.stringify(myUserObj.profile.organizations)); // clone organizations
        }
      } else {
        // default to the global group if there is no org info stored on the profile
        myOrganizations = [_GLOBAL_GROUP];
      }
    }
    return myOrganizations;
  }

  /**
   * Retrieve users roles
   * @param {Object} user user object
   * @param {String} [group] Optional name of group to restrict roles to.
   *                         User's _GLOBAL_GROUP will also be included.
   * @return {Array} Array of user's roles, unsorted.
   */
  static _getRolesForUser(user, group) {
    if (!user) return []
    if (group) {
      if ('string' !== typeof group) return []
      if ('$' === group[0]) return []

      // convert any periods to underscores
      group = group.replace(/\./g, '_')
    }

    if ('object' !== typeof user) {
      // invalid user object
      return []
    }

    if (!user || !user.roles) return []

    if (group) {
      return _.union(user.roles[group] || [], user.roles[_GLOBAL_GROUP] || [])
    }

    if (_.isArray(user.roles))
      return user.roles

    // using groups but group not specified. return global group, if exists
    return user.roles[_GLOBAL_GROUP] || []
  }

  /**
   * Find a role in the hierarchy by name
   * @param {string} roleName - the name of the role to find
   * @returns {*} - the node in the tree that matches
   */
  findRoleInHierarchy(roleName, startNode) {
    let result = this._findNode(roleName, startNode);
    if (result && result.model) {
      this.logger.debug(`findRoleInHierarchy(${roleName}) => returning ${JSON.stringify(result.model, null, 2)}`);
      return result.model;
    }
    this.logger.debug(`findRoleInHierarchy(${roleName}) => returning undefined`);

  }

  /**
   * Return the subordinate roles of the given seniorRoleName
   * @param {string} seniorRoleName - the name of the senior role
   * @param {string} subordinateRoleName - the name of the subordinate role
   * @returns {object} - the role of the subordinate, or false if not found.
   */
  getRoleSubordinate(seniorRoleName, subordinateRoleName, startNode) {
    // get the node for the senior role name
    let senior = this._findNode(seniorRoleName, startNode);
    if (!senior) {
      return false;
    }
    let junior = this._findNode(subordinateRoleName, senior);
    if (junior) {
      this.logger.debug(`getRoleSubordinate(${seniorRoleName},${subordinateRoleName}) => returning ${JSON.stringify(junior.model, null, 2)}`);
      return junior.model;
    } else {
      this.logger.debug(`getAllSubordinatesAsArray(${seniorRoleName}) => returning undefined`);
    }
  }

  /**
   * Get the names of subordinate roles as an array
   * @param {string} seniorRoleName - the name of the senior role
   * @returns {Array} - the subordinate role names if any, otherwise undefined.
   */
  getAllSubordinateRolesAsArray(seniorRoleName, startNode) {
    // find the node for the given role name
    let seniorRole = this._findNode(seniorRoleName, startNode);
    // get all the nodes under this one
    let result = seniorRole.all({ strategy: 'breadth' }, function (node) {
      return node.model.name !== seniorRoleName;
    }).map((item) => { // get the names of each node
      return item.model.name;
    });
    this.logger.debug(`getAllSubordinatesAsArray(${seniorRoleName}) => returning ${JSON.stringify(result, null, 2)}`);
    return result;
  }

  /**
   * Get an array of all of the role names that the provided user can administer
   * @param myUserObj the user object of the provided user, with a roles property and a profile.organization or profile.organizations
   * @returns {Object} an object of subordinate {organization:[roleName, roleName]} arrays that the provided user can administer
   */
  getAllUserSubordinatesAsArray(myUserObj, startNode = this.root) {
    let debug = this.logger.debug;
    let rolesICanAdminister = {}, myOrganizations = [];
    // I might have a few roles, and a few organizations.
    if (myUserObj) {
      myOrganizations = this._getOrganizationsForUser(myUserObj); // e.g. ["the app workshop","good life gym"]
      myOrganizations.forEach(function (thisOrganization) {

        let myRoles = RoleHierarchy._getRolesForUser(myUserObj, thisOrganization) || []; // e.g. ["manager"]
        // debug(`RoleHierarchy._getRolesForUser(${myUserObj}, ${group}) => returning ${myRoles}`);

        // for each role I have, add the subordinate roles to the list of roles I can administer for this org.
        let mySubordinateRolesForThisOrg = [];
        for (var thisRole in myRoles) {
          if (myRoles.hasOwnProperty(thisRole)) {
            // debug(`myRoles[thisRole]: ${myRoles[thisRole]}`);
            // add this role
            var thisRoleObjInHierarchy = this._findNode(myRoles[thisRole], startNode);
            if (thisRoleObjInHierarchy) {
              // debug(`thisRoleObjInHierarchy: ${JSON.stringify(thisRoleObjInHierarchy.model,null,2)}`);

              // add all of the subordinate role names from the hierarchy
              mySubordinateRolesForThisOrg = _.union(mySubordinateRolesForThisOrg, this.getAllSubordinateRolesAsArray(myRoles[thisRole], thisRoleObjInHierarchy, startNode));
            } // role not in hierarchy. That's OK, but we don't know anything about it.
          }
        }
        rolesICanAdminister[thisOrganization] = mySubordinateRolesForThisOrg;
      }, this);
    }

    debug(`getAllUserSubordinatesAsArray(${JSON.stringify(myUserObj)}) => returning ${JSON.stringify(rolesICanAdminister)}`);
    return rolesICanAdminister;
  }


  /**
   * Get an object of all of the Meteor.user fields that the provided user can see
   * @param myUserObj the user object of the provided user, with a roles property
   * @returns {object} an object of the format {orgName: [{field1: 1, field2: 2}]}, the values being Meteor.user field names that the provided user can see, suitable for inclusion 
   * as a "fields" property in a mongodb Collection query.
   */
  getAllMyFieldsAsObject(myUserObj, startNode = this.root) {
    let debug = this.logger.debug;
    let visibleUserFields = {}, myOrganizations = [];
    // I might have a few roles.
    if (myUserObj) {
      myOrganizations = this._getOrganizationsForUser(myUserObj); // e.g. ["the app workshop","good life gym"]
      let rolesICanAdminister = this.getAllUserSubordinatesAsArray(myUserObj, startNode);
      // debug(`rolesICanAdminister = ${JSON.stringify(rolesICanAdminister)}`);

      myOrganizations.forEach((thisOrganization) => {
        let myRoles = RoleHierarchy._getRolesForUser(myUserObj, thisOrganization) || []; // e.g. ["manager"]
        // debug(`myRoles(${thisOrganization}) = ${JSON.stringify(myRoles)}`);

        let allRolesICanSeeForThisOrg;
        if (rolesICanAdminister.hasOwnProperty(thisOrganization)) {
          allRolesICanSeeForThisOrg = _.union(myRoles, rolesICanAdminister[thisOrganization]);
        } else {
          allRolesICanSeeForThisOrg = myRoles;
        }

        debug(`allRolesICanSeeForThisOrg(${thisOrganization}) = ${JSON.stringify(allRolesICanSeeForThisOrg)}`);

        let visibleUserFieldsForThisOrg = {};
        // for each role I have, add the subordinate roles' fields to the list of fields I can see for this org.
        for (var thisRole in allRolesICanSeeForThisOrg) {
          if (allRolesICanSeeForThisOrg.hasOwnProperty(thisRole)) {
            // add this role
            var thisRoleObjInHierarchy = this._findNode(allRolesICanSeeForThisOrg[thisRole], startNode);
            if (thisRoleObjInHierarchy) {

              debug(`thisRoleObjInHierarchy: ${JSON.stringify(thisRoleObjInHierarchy.model)}`);

              // add all of the visible user fields from this object in the hierarchy
              visibleUserFieldsForThisOrg = _.extend(visibleUserFieldsForThisOrg, thisRoleObjInHierarchy.model.visibleUserFields);
              debug(`visibleFields: ${JSON.stringify(visibleUserFieldsForThisOrg)}`);

            } // role not in hierarchy. That's OK, but we don't know anything about it.
          }
        }

        visibleUserFields[thisOrganization] = visibleUserFieldsForThisOrg;
        debug(`visibleUserFields = ${JSON.stringify(visibleUserFields, null, 2)}`);
      }, this);
    }

    debug(`getAllMyFieldsAsObject(${JSON.stringify(myUserObj)}) => returning ${JSON.stringify(visibleUserFields, null, 2)}`);
    return visibleUserFields;
  }

  /**
   * returns true if the given userId can administer the given role.
   * @param myUserObj the user object of the provided user, with a roles property
   * @param roleName the name of the role to query
   * @param organizationName the name of the organization to query whether the user has the role
   */
  isUserCanAdministerRole(myUserObj, roleName, organizationName, startNode = this.root) {
    var allSubordinateRoles = this.getAllUserSubordinatesAsArray(myUserObj, startNode);
  }

  /**
   * returns true if the given adminId can administer the given userId.
   * @param adminObj the user Object of the user we're checking, with roles property
   * @param subordinateObj the user object of the subordinate to check (with roles property)
   */
  isUserCanAdministerUserfunction(adminObj, subordinateObj) { }

  /**
   * Copy the given user's profile properties (as specified in RolesTree) as query criteria.
   * @param {object} userWithProfile - the user object, with a profile property to copy
   * @param {object} profileFilterCriteria - existing profileFilterCriteria. Note that if any properties are already specified, they may
   *  get overwritten.
   * @returns {*} the query criteria to ensure only users with the same profile property values will be returned.
   */
  copyProfileCriteriaFromUser(userWithProfile, profileFilterCriteria) { }

  getTopiaryAsString(hierarchy = this.root) {
    return topiary(hierarchy, 'subordinates');
  }
}

module.exports = RoleHierarchy;