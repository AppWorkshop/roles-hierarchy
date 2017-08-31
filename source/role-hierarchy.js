import Hierarchy from 'hierarchy-model';

const winston = require('winston');
process.env.SUPPRESS_NO_CONFIG_WARNING = 'y';
const TreeModel = require('tree-model');
const topiary = require('topiary');
const _ = require('underscore');

const _GLOBAL_GROUP = "__global_roles__";

const _getOrganizationsForUser = function _getOrganizationsForUser(myUserObj) {
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

const _getRolesForUser = function _getRolesForUser(user, group) {
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

class RoleHierarchy extends Hierarchy {

  /**
   * create a new instance of RoleHierarchy
   * @param {Object} paramsObj containing a hierarchy and a loggingConfig (optional) and a TreeModel config (optional):
   * {
   *   hierarchy: {"name":"teacher", "subordinates": [ {"name":"student"} ]},
   *   treeModelConfig: { "childrenPropertyName": "subordinates" },
   *   loggingConfig: { "level": "debug"}
   * }
   */
  constructor(paramsObj) {
    super(paramsObj);
  }

  /**
   * re-create the hierarchy with a new object structure.
   * @param {Object} rolesHierarchy 
   */
  reparse(rolesHierarchy) {
    this.root = this.treeModel.parse(rolesHierarchy);
  }

  /**
   * Get the organizations that the user belongs to, as an array.
   * @param {Object} myUserObj an object containing an organization or organizations property.
   * @returns {Array<String>} an array of the organizations that the user belongs to.
   */
  static getOrganizationsForUser(myUserObj) {
    return _getOrganizationsForUser(myUserObj);
  }

  /**
   * Deprecated - use RoleHierarchy.getOrganizationsForUser instead.
   * @param {*} myUserObj 
   */
  _getOrganizationsForUser(myUserObj) {
    return _getOrganizationsForUser(myUserObj);
  }

  /**
   * Retrieve users roles
   * @param {Object} user user object
   * @param {String} organization Optional name of organization to restrict roles to.
   *                         User's _GLOBAL_GROUP will also be included.
   * @return {Array} Array of user's roles, unsorted.
   */
  static getRolesForUser(user, organization) {
    return _getRolesForUser(user, organization);
  }
  
  /**
   * Deprecated. Use RoleHierarchy.getRolesForUser instead.
   * @param {*} user 
   * @param {*} organization 
   */
  static _getRolesForUser(user, organization) {
    return _getRolesForUser(user, organization);
  }

  /**
   * Find a role in the hierarchy by name
   * @param {string} roleName - the name of the role to find
   * @returns {object} - the node in the tree that matches
   */
  findRoleInHierarchy(roleName, startNode) {
    return this.findNodeInHierarchy(roleName, startNode);
  }

  /**
   * Return the subordinate roles of the given seniorRoleName
   * @param {string} seniorRoleName - the name of the senior role
   * @param {string} subordinateRoleName - the name of the subordinate role
   * @returns {object} - the role of the subordinate, or false if not found.
   */
  getRoleSubordinate(seniorRoleName, subordinateRoleName, startNode) {
    return this.findDescendantNodeByName(seniorRoleName, subordinateRoleName, startNode);
  }

  /**
   * Get the names of subordinate roles as an array
   * @param {string} seniorRoleName - the name of the senior role
   * @returns {Array} - the subordinate role names if any, otherwise undefined.
   */
  getAllSubordinateRolesAsArray(seniorRoleName, startNode) {
    return this.getAllDescendantNodesAsArray(seniorRoleName, startNode);
  }

  /**
   * Get a map of all of the role names that the provided user can administer, grouped by organization
   * @param myUserObj the user object of the provided user, with a roles property and a profile.organization or profile.organizations
   * @returns {Object} an object of subordinate {organization:[roleName, roleName]} arrays that the provided user can administer
   */
  getAllUserSubordinatesAsMap(myUserObj, startNode = this.root) {
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

    debug(`getAllUserSubordinatesAsMap(${JSON.stringify(myUserObj)}) => returning ${JSON.stringify(rolesICanAdminister)}`);
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
      let rolesICanAdminister = this.getAllUserSubordinatesAsMap(myUserObj, startNode);
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
   * returns true if the given object is more senior than the given role in the given organization.
   * @param myUserObj the user object of the provided user, with a roles property and an organization(s) property
   * @param roleName the name of the role to query
   * @param organizationName the name of the organization to query whether the user has the role
   * @returns {boolean} true if the user is more senior than the given role
   */
  isUserHasMoreSeniorRole(myUserObj, roleName, organizationName, startNode = this.root) {
    let debug = this.logger.debug;    

    var orgSubordinates = this.getAllUserSubordinatesAsMap(myUserObj, startNode);
    // orgSubordinates is of the format {organization:[roleName, roleName], org2: [roleName, roleName]}
    if (orgSubordinates && orgSubordinates.hasOwnProperty(organizationName)) {
      let ourOrgSubordinatesArr = orgSubordinates[organizationName];

      // ourOrgSubordinatesArr is like ["manager","supervillain"]
      if (ourOrgSubordinatesArr && ourOrgSubordinatesArr.length) {
        let retVal = !!(ourOrgSubordinatesArr.find(
          (subordinateRoleName)=>{ return subordinateRoleName === roleName;}, // this is the droid you're looking for.
          this));
        debug(`isUserHasMoreSeniorRole(${JSON.stringify(myUserObj)},${roleName},${organizationName}) => returning ${retVal}`);          
        return retVal;
      }
    }
    debug(`isUserHasMoreSeniorRole(${JSON.stringify(myUserObj)},${roleName},${organizationName}) => returning false`);          
    return false;
  }

  /**
   * returns true if the given senior user is higher in the hierarchy than the given subordinate user for the given organization.
   * @param seniorUserObj the senior user we're checking, with roles property and organization(s) property
   * @param subordinateUserObj the user we want to check see if they are subordinate to the senior user, with roles property and organization(s) property
   * @param organizationName the name of the organization whose roles to check
   * @returns {boolean} true if the subordinateUser is below seniorUser in the hierarchy for at least one organization in common.
   */
  isUserDescendantOfUser(seniorUserObj, subordinateUserObj, organizationName) { 
    // 1. get the organizations and roles of the senior user. 
    // 2. get the organizations and roles of the subordinate.
    // 3. Get the roles that the senior user can administer for this org.
    // 4. For each such role that the senior user can administer, see if the subordinate has one of these roles.

    let debug = this.logger.debug;    

    let seniorRolesMap = seniorUserObj.roles; // { "justice league": ["admin","hero"], "yankees": ["member"], ... }
    let subordinateRolesMap = subordinateUserObj.roles; // { "fsociety": ["unwitting leader","member"], "yankees": ["coach","member"], "freemasons": ["grand wizard"] }
    let subordinateOrgs = _.keys(subordinateOrgs); // ["fsociety", "freemasons", "yankees"]

    if (!seniorRolesMap.hasOwnProperty(organizationName) || !subordinateRolesMap.hasOwnProperty(organizationName)) {
      // one of our users doesn't know anything about the organization
      return false;
    }
    let seniorsSubordinatesMap = this.getAllUserSubordinatesAsMap(seniorUserObj); // { "justice league": ["hero","janitor"] } -> note the user doesn't necessarily HAVE all of these roles
    // find the senior user'ss subordinate roles for this org
    if (!seniorsSubordinatesMap.hasOwnProperty(organizationName)) {
      // no subordinate roles at all for this user in this org
      return false;
    }

    let seniorsSubordinateRolesForOrg = seniorsSubordinatesMap[organizationName]; // ["hero","janitor"];
    let subordinateRolesForOrg = subordinateRolesMap[organizationName]; // ["hero"];
    if (!seniorsSubordinateRolesForOrg || !seniorsSubordinateRolesForOrg.length) { // no subordinate roles in this org for this user
      return false;
    }
    if (!subordinateRolesForOrg || !subordinateRolesForOrg.length) { // no roles in this org for this user
      return false;
    }

    // see if there's any intersection between the roles the senior can administer for this org and the roles the subordinate has for this org.
    let inCommon = _.intersection(seniorsSubordinateRolesForOrg, subordinateRolesForOrg);
    debug(`isUserDescendantOfUser(${JSON.stringify(seniorUserObj)},${JSON.stringify(subordinateUserObj)},${organizationName}) => returning ${inCommon}`);          
    return (inCommon && inCommon.length);
  }

  /**
   * Copy the given user's profile properties (as specified in roles hierarchy as profileFilters) as profile properties suitable for adding to a new user.
   * @param {object} userWithProfile - the user object, with a profile property to copy
   * @param {object} profileFilterCriteria - existing profileFilterCriteria. Note that if any properties are already specified, they may
   *  get overwritten.
   * @param {string} organizationName - the organization we're dealing with.
   * @returns {object} the query criteria, suitable for mongodb, to ensure only users with the same values for the specified fields will be returned.
   */
  getProfileCriteriaFromUser(userWithProfile, profileFilterCriteria, organizationName) {
    //TODO : copy profile filters from ALL more senior nodes in the hierarchy. As it is, we have to specify them at every level.
    let debug = this.logger.debug;    
    let userRolesMap = userWithProfile.roles; // { "justice league": ["admin","hero"], "yankees": ["member"], ... }
    if (!userRolesMap.hasOwnProperty(organizationName)) {
      // Not much we can do.... 
      return profileFilterCriteria;
    }

    var rolesArray = userRolesMap[organizationName]; // ["admin", "hero"]
    for (var roleIndex in rolesArray) {
      if (userWithProfile.profile && rolesArray.hasOwnProperty(roleIndex)) {
        // find this role in the hierarchy
        var thisRole = this.findRoleInHierarchy(rolesArray[roleIndex]);
        // copy the profile filters
        if (thisRole && thisRole.profileFilters) { // it might not be in our hierarchy

          // loop through the profile filters (if any)
          for (var filterIndex in thisRole.profileFilters) {
            if (thisRole.profileFilters.hasOwnProperty(filterIndex)) {
              var thisProfileFilter = thisRole.profileFilters[filterIndex];
              // a profile filter is an array of property names to copy from the user's profile
              if (userWithProfile.profile.hasOwnProperty(thisProfileFilter)) {
                // OK let's copy it to our criteria
                profileFilterCriteria = profileFilterCriteria || {}; // initialize if needed.
                profileFilterCriteria["profile." + thisProfileFilter] = userWithProfile.profile[thisProfileFilter];
              }
            }
          }
        }
      }
    }
    debug(`getProfileCriteriaFromUser(${JSON.stringify(userWithProfile)}, ${JSON.stringify(profileFilterCriteria)}, ${organizationName}) => returning ${JSON.stringify(profileFilterCriteria)}`);
    
    return profileFilterCriteria;
  }

}

module.exports = RoleHierarchy;