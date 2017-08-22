'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var winston = require('winston');
process.env.SUPPRESS_NO_CONFIG_WARNING = 'y';
var config = require('config');
var TreeModel = require('tree-model');
var topiary = require('topiary');
var _ = require('underscore');

var _GLOBAL_GROUP = "__global_roles__";

var RoleHierarchy = function () {

  /**
   * create a new instance of RoleHierarchy
   * @param {Object} paramsObj containing:
   * {
   *   }
   */
  function RoleHierarchy(paramsObj) {
    _classCallCheck(this, RoleHierarchy);

    // set up config defaults
    this.logger = new winston.Logger({
      transports: [new winston.transports.Console(paramsObj.loggingConfig)]
    });

    // actual constructor stuff here.

    // get treeModelConfig from config
    // need to clone the treeModelConfig
    var treeModelConfig = JSON.parse(JSON.stringify(paramsObj.treeModelConfig));
    this.treeModel = new TreeModel(treeModelConfig);
    this.root = this.treeModel.parse(paramsObj.rolesHierarchy);
    this.logger.debug(this.getTopiaryAsString(this.root.model));
  }

  /**
   * re-create the hierarchy with a new object structure.
   * @param {Object} rolesHierarchy 
   */


  _createClass(RoleHierarchy, [{
    key: 'reparse',
    value: function reparse(rolesHierarchy) {
      this.root = this.treeModel.parse(rolesHierarchy);
    }
  }, {
    key: '_findNode',
    value: function _findNode(roleName) {
      var startNode = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.root;

      return startNode.first({ strategy: 'breadth' }, function (node) {
        return node.model.name === roleName;
      });
    }
  }, {
    key: '_getOrganizationsForUser',
    value: function _getOrganizationsForUser(myUserObj) {
      var myOrganizations = [];
      if (myUserObj) {
        // figure out which organizations we belong to.
        if (myUserObj.profile && (myUserObj.profile.organization || myUserObj.profile.organizations)) {
          // note the plural
          if (myUserObj.profile.organization) {
            // there can be only one.
            myOrganizations = [myUserObj.profile.organization];
          } else {
            // this guy is in multiple organizations.
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

  }, {
    key: 'findRoleInHierarchy',


    /**
     * Find a role in the hierarchy by name
     * @param {string} roleName - the name of the role to find
     * @returns {*} - the node in the tree that matches
     */
    value: function findRoleInHierarchy(roleName, startNode) {
      var result = this._findNode(roleName, startNode);
      if (result && result.model) {
        this.logger.debug('findRoleInHierarchy(' + roleName + ') => returning ' + JSON.stringify(result.model, null, 2));
        return result.model;
      }
      this.logger.debug('findRoleInHierarchy(' + roleName + ') => returning undefined');
    }

    /**
     * Return the subordinate roles of the given seniorRoleName
     * @param {string} seniorRoleName - the name of the senior role
     * @param {string} subordinateRoleName - the name of the subordinate role
     * @returns {object} - the role of the subordinate, or false if not found.
     */

  }, {
    key: 'getRoleSubordinate',
    value: function getRoleSubordinate(seniorRoleName, subordinateRoleName, startNode) {
      // get the node for the senior role name
      var senior = this._findNode(seniorRoleName, startNode);
      if (!senior) {
        return false;
      }
      var junior = this._findNode(subordinateRoleName, senior);
      if (junior) {
        this.logger.debug('getRoleSubordinate(' + seniorRoleName + ',' + subordinateRoleName + ') => returning ' + JSON.stringify(junior.model, null, 2));
        return junior.model;
      } else {
        this.logger.debug('getAllSubordinatesAsArray(' + seniorRoleName + ') => returning undefined');
      }
    }

    /**
     * Get the names of subordinate roles as an array
     * @param {string} seniorRoleName - the name of the senior role
     * @returns {Array} - the subordinate role names if any, otherwise undefined.
     */

  }, {
    key: 'getAllSubordinateRolesAsArray',
    value: function getAllSubordinateRolesAsArray(seniorRoleName, startNode) {
      // find the node for the given role name
      var seniorRole = this._findNode(seniorRoleName, startNode);
      // get all the nodes under this one
      var result = seniorRole.all({ strategy: 'breadth' }, function (node) {
        return node.model.name !== seniorRoleName;
      }).map(function (item) {
        // get the names of each node
        return item.model.name;
      });
      this.logger.debug('getAllSubordinatesAsArray(' + seniorRoleName + ') => returning ' + JSON.stringify(result, null, 2));
      return result;
    }

    /**
     * Get an array of all of the role names that the provided user can administer
     * @param myUserObj the user object of the provided user, with a roles property and a profile.organization or profile.organizations
     * @returns {Object} an object of subordinate {organization:[roleName, roleName]} arrays that the provided user can administer
     */

  }, {
    key: 'getAllUserSubordinatesAsArray',
    value: function getAllUserSubordinatesAsArray(myUserObj) {
      var startNode = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.root;

      var debug = this.logger.debug;
      var rolesICanAdminister = {},
          myOrganizations = [];
      // I might have a few roles, and a few organizations.
      if (myUserObj) {
        myOrganizations = this._getOrganizationsForUser(myUserObj); // e.g. ["the app workshop","good life gym"]
        myOrganizations.forEach(function (thisOrganization) {

          var myRoles = RoleHierarchy._getRolesForUser(myUserObj, thisOrganization) || []; // e.g. ["manager"]
          // debug(`RoleHierarchy._getRolesForUser(${myUserObj}, ${group}) => returning ${myRoles}`);

          // for each role I have, add the subordinate roles to the list of roles I can administer for this org.
          var mySubordinateRolesForThisOrg = [];
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

      debug('getAllUserSubordinatesAsArray(' + JSON.stringify(myUserObj) + ') => returning ' + JSON.stringify(rolesICanAdminister));
      return rolesICanAdminister;
    }

    /**
     * Get an object of all of the Meteor.user fields that the provided user can see
     * @param myUserObj the user object of the provided user, with a roles property
     * @returns {object} an object of the format {orgName: [{field1: 1, field2: 2}], the values being Meteor.user field names that the provided user can see, suitable for inclusion 
     * as a "fields" property in a mongodb Collection query.
     */

  }, {
    key: 'getAllMyFieldsAsObject',
    value: function getAllMyFieldsAsObject(myUserObj) {
      var _this = this;

      var startNode = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.root;

      var debug = this.logger.debug;
      var visibleUserFields = {},
          myOrganizations = [];
      // I might have a few roles.
      if (myUserObj) {
        myOrganizations = this._getOrganizationsForUser(myUserObj); // e.g. ["the app workshop","good life gym"]
        var rolesICanAdminister = this.getAllUserSubordinatesAsArray(myUserObj, startNode);
        // debug(`rolesICanAdminister = ${JSON.stringify(rolesICanAdminister)}`);

        myOrganizations.forEach(function (thisOrganization) {
          var myRoles = RoleHierarchy._getRolesForUser(myUserObj, thisOrganization) || []; // e.g. ["manager"]
          // debug(`myRoles(${thisOrganization}) = ${JSON.stringify(myRoles)}`);

          var allRolesICanSeeForThisOrg = void 0;
          if (rolesICanAdminister.hasOwnProperty(thisOrganization)) {
            allRolesICanSeeForThisOrg = _.union(myRoles, rolesICanAdminister[thisOrganization]);
          } else {
            allRolesICanSeeForThisOrg = myRoles;
          }

          debug('allRolesICanSeeForThisOrg(' + thisOrganization + ') = ' + JSON.stringify(allRolesICanSeeForThisOrg));

          var visibleUserFieldsForThisOrg = {};
          // for each role I have, add the subordinate roles' fields to the list of fields I can see for this org.
          for (var thisRole in allRolesICanSeeForThisOrg) {
            if (allRolesICanSeeForThisOrg.hasOwnProperty(thisRole)) {
              // add this role
              var thisRoleObjInHierarchy = _this._findNode(allRolesICanSeeForThisOrg[thisRole], startNode);
              if (thisRoleObjInHierarchy) {

                debug('thisRoleObjInHierarchy: ' + JSON.stringify(thisRoleObjInHierarchy.model));

                // add all of the visible user fields from this object in the hierarchy
                visibleUserFieldsForThisOrg = _.extend(visibleUserFieldsForThisOrg, thisRoleObjInHierarchy.model.visibleUserFields);
                debug('visibleFields: ' + JSON.stringify(visibleUserFieldsForThisOrg));
              } // role not in hierarchy. That's OK, but we don't know anything about it.
            }
          }

          visibleUserFields[thisOrganization] = visibleUserFieldsForThisOrg;
          debug('visibleUserFields = ' + JSON.stringify(visibleUserFields, null, 2));
        }, this);
      }

      debug('getAllMyFieldsAsObject(' + JSON.stringify(myUserObj) + ') => returning ' + JSON.stringify(visibleUserFields, null, 2));
      return visibleUserFields;
    }

    /**
     * returns true if the given userId can administer the given role.
     * @param myUserObj the user object of the provided user, with a roles property
     * @param roleName the name of the role to query
     * @param organizationName the name of the organization to query whether the user has the role
     */

  }, {
    key: 'isUserCanAdministerRole',
    value: function isUserCanAdministerRole(myUserObj, roleName, organizationName) {
      var startNode = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : this.root;

      var allSubordinateRoles = this.getAllUserSubordinatesAsArray(myUserObj, startNode);
    }

    /**
     * returns true if the given adminId can administer the given userId.
     * @param adminObj the user Object of the user we're checking, with roles property
     * @param subordinateObj the user object of the subordinate to check (with roles property)
     */

  }, {
    key: 'isUserCanAdministerUserfunction',
    value: function isUserCanAdministerUserfunction(adminObj, subordinateObj) {}

    /**
     * Copy the given user's profile properties (as specified in RolesTree) as query criteria.
     * @param {object} userWithProfile - the user object, with a profile property to copy
     * @param {object} profileFilterCriteria - existing profileFilterCriteria. Note that if any properties are already specified, they may
     *  get overwritten.
     * @returns {*} the query criteria to ensure only users with the same profile property values will be returned.
     */

  }, {
    key: 'copyProfileCriteriaFromUser',
    value: function copyProfileCriteriaFromUser(userWithProfile, profileFilterCriteria) {}
  }, {
    key: 'getTopiaryAsString',
    value: function getTopiaryAsString() {
      var hierarchy = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.root;

      return topiary(hierarchy, 'subordinates');
    }
  }], [{
    key: '_getRolesForUser',
    value: function _getRolesForUser(user, group) {
      if (!user) return [];
      if (group) {
        if ('string' !== typeof group) return [];
        if ('$' === group[0]) return [];

        // convert any periods to underscores
        group = group.replace(/\./g, '_');
      }

      if ('object' !== (typeof user === 'undefined' ? 'undefined' : _typeof(user))) {
        // invalid user object
        return [];
      }

      if (!user || !user.roles) return [];

      if (group) {
        return _.union(user.roles[group] || [], user.roles[_GLOBAL_GROUP] || []);
      }

      if (_.isArray(user.roles)) return user.roles;

      // using groups but group not specified. return global group, if exists
      return user.roles[_GLOBAL_GROUP] || [];
    }
  }]);

  return RoleHierarchy;
}();

module.exports = RoleHierarchy;