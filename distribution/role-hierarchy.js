'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _hierarchyModel = require('hierarchy-model');

var _hierarchyModel2 = _interopRequireDefault(_hierarchyModel);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var winston = require('winston');
process.env.SUPPRESS_NO_CONFIG_WARNING = 'y';
var TreeModel = require('tree-model');
var topiary = require('topiary');
var _ = require('underscore');

var _GLOBAL_GROUP = "__global_roles__";

var _getOrganizationsForUser2 = function _getOrganizationsForUser(myUserObj) {
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
};

var _getRolesForUser2 = function _getRolesForUser(user, group) {
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
};

var RoleHierarchy = function (_Hierarchy) {
  _inherits(RoleHierarchy, _Hierarchy);

  /**
   * create a new instance of RoleHierarchy
   * @param {Object} paramsObj containing a hierarchy and a loggingConfig (optional) and a TreeModel config (optional):
   * {
   *   hierarchy: {"name":"teacher", "subordinates": [ {"name":"student"} ]},
   *   treeModelConfig: { "childrenPropertyName": "subordinates" },
   *   loggingConfig: { "level": "debug"}
   * }
   */
  function RoleHierarchy(paramsObj) {
    _classCallCheck(this, RoleHierarchy);

    return _possibleConstructorReturn(this, (RoleHierarchy.__proto__ || Object.getPrototypeOf(RoleHierarchy)).call(this, paramsObj));
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

    /**
     * Get the organizations that the user belongs to, as an array.
     * @param {Object} myUserObj an object containing an organization or organizations property.
     * @returns {Array<String>} an array of the organizations that the user belongs to.
     */

  }, {
    key: '_getOrganizationsForUser',


    /**
     * Deprecated - use RoleHierarchy.getOrganizationsForUser instead.
     * @param {*} myUserObj 
     */
    value: function _getOrganizationsForUser(myUserObj) {
      return _getOrganizationsForUser2(myUserObj);
    }

    /**
     * Retrieve users roles
     * @param {Object} user user object
     * @param {String} organization Optional name of organization to restrict roles to.
     *                         User's _GLOBAL_GROUP will also be included.
     * @return {Array} Array of user's roles, unsorted.
     */

  }, {
    key: 'findRoleInHierarchy',


    /**
     * Find a role in the hierarchy by name
     * @param {string} roleName - the name of the role to find
     * @returns {object} - the node in the tree that matches
     */
    value: function findRoleInHierarchy(roleName, startNode) {
      return this.findNodeInHierarchy(roleName, startNode);
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
      return this.findDescendantNodeByName(seniorRoleName, subordinateRoleName, startNode);
    }

    /**
     * Get the names of subordinate roles as an array
     * @param {string} seniorRoleName - the name of the senior role
     * @returns {Array} - the subordinate role names if any, otherwise undefined.
     */

  }, {
    key: 'getAllSubordinateRolesAsArray',
    value: function getAllSubordinateRolesAsArray(seniorRoleName, startNode) {
      return this.getAllDescendantNodesAsArray(seniorRoleName, startNode);
    }

    /**
     * Get a map of all of the role names that the provided user can administer, grouped by organization
     * @param myUserObj the user object of the provided user, with a roles property and a profile.organization or profile.organizations
     * @returns {Object} an object of subordinate {organization:[roleName, roleName]} arrays that the provided user can administer
     */

  }, {
    key: 'getAllUserSubordinatesAsMap',
    value: function getAllUserSubordinatesAsMap(myUserObj) {
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

      debug('getAllUserSubordinatesAsMap(' + JSON.stringify(myUserObj) + ') => returning ' + JSON.stringify(rolesICanAdminister));
      return rolesICanAdminister;
    }

    /**
     * Get an object of all of the Meteor.user fields that the provided user can see
     * @param myUserObj the user object of the provided user, with a roles property
     * @returns {object} an object of the format {orgName: [{field1: 1, field2: 2}]}, the values being Meteor.user field names that the provided user can see, suitable for inclusion 
     * as a "fields" property in a mongodb Collection query.
     */

  }, {
    key: 'getAllMyFieldsAsObject',
    value: function getAllMyFieldsAsObject(myUserObj) {
      var _this2 = this;

      var startNode = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.root;

      var debug = this.logger.debug;
      var visibleUserFields = {},
          myOrganizations = [];
      // I might have a few roles.
      if (myUserObj) {
        myOrganizations = this._getOrganizationsForUser(myUserObj); // e.g. ["the app workshop","good life gym"]
        var rolesICanAdminister = this.getAllUserSubordinatesAsMap(myUserObj, startNode);
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
              var thisRoleObjInHierarchy = _this2._findNode(allRolesICanSeeForThisOrg[thisRole], startNode);
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
     * returns true if the given object is more senior than the given role in the given organization.
     * @param myUserObj the user object of the provided user, with a roles property and an organization(s) property
     * @param roleName the name of the role to query
     * @param organizationName the name of the organization to query whether the user has the role
     * @returns {boolean} true if the user is more senior than the given role
     */

  }, {
    key: 'isUserHasMoreSeniorRole',
    value: function isUserHasMoreSeniorRole(myUserObj, roleName, organizationName) {
      var startNode = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : this.root;

      var debug = this.logger.debug;

      var orgSubordinates = this.getAllUserSubordinatesAsMap(myUserObj, startNode);
      // orgSubordinates is of the format {organization:[roleName, roleName], org2: [roleName, roleName]}
      if (orgSubordinates && orgSubordinates.hasOwnProperty(organizationName)) {
        var ourOrgSubordinatesArr = orgSubordinates[organizationName];

        // ourOrgSubordinatesArr is like ["manager","supervillain"]
        if (ourOrgSubordinatesArr && ourOrgSubordinatesArr.length) {
          var retVal = !!ourOrgSubordinatesArr.find(function (subordinateRoleName) {
            return subordinateRoleName === roleName;
          }, // this is the droid you're looking for.
          this);
          debug('isUserHasMoreSeniorRole(' + JSON.stringify(myUserObj) + ',' + roleName + ',' + organizationName + ') => returning ' + retVal);
          return retVal;
        }
      }
      debug('isUserHasMoreSeniorRole(' + JSON.stringify(myUserObj) + ',' + roleName + ',' + organizationName + ') => returning false');
      return false;
    }

    /**
     * returns true if the given senior user is higher in the hierarchy than the given subordinate user for the given organization.
     * @param seniorUserObj the senior user we're checking, with roles property and organization(s) property
     * @param subordinateUserObj the user we want to check see if they are subordinate to the senior user, with roles property and organization(s) property
     * @param organizationName the name of the organization whose roles to check
     * @returns {boolean} true if the subordinateUser is below seniorUser in the hierarchy for at least one organization in common.
     */

  }, {
    key: 'isUserDescendantOfUser',
    value: function isUserDescendantOfUser(seniorUserObj, subordinateUserObj, organizationName) {
      // 1. get the organizations and roles of the senior user. 
      // 2. get the organizations and roles of the subordinate.
      // 3. Get the roles that the senior user can administer for this org.
      // 4. For each such role that the senior user can administer, see if the subordinate has one of these roles.

      var debug = this.logger.debug;

      var seniorRolesMap = seniorUserObj.roles; // { "justice league": ["admin","hero"], "yankees": ["member"], ... }
      var subordinateRolesMap = subordinateUserObj.roles; // { "fsociety": ["unwitting leader","member"], "yankees": ["coach","member"], "freemasons": ["grand wizard"] }
      var subordinateOrgs = _.keys(subordinateOrgs); // ["fsociety", "freemasons", "yankees"]

      if (!seniorRolesMap.hasOwnProperty(organizationName) || !subordinateRolesMap.hasOwnProperty(organizationName)) {
        // one of our users doesn't know anything about the organization
        return false;
      }
      var seniorsSubordinatesMap = this.getAllUserSubordinatesAsMap(seniorUserObj); // { "justice league": ["hero","janitor"] } -> note the user doesn't necessarily HAVE all of these roles
      // find the senior user'ss subordinate roles for this org
      if (!seniorsSubordinatesMap.hasOwnProperty(organizationName)) {
        // no subordinate roles at all for this user in this org
        return false;
      }

      var seniorsSubordinateRolesForOrg = seniorsSubordinatesMap[organizationName]; // ["hero","janitor"];
      var subordinateRolesForOrg = subordinateRolesMap[organizationName]; // ["hero"];
      if (!seniorsSubordinateRolesForOrg || !seniorsSubordinateRolesForOrg.length) {
        // no subordinate roles in this org for this user
        return false;
      }
      if (!subordinateRolesForOrg || !subordinateRolesForOrg.length) {
        // no roles in this org for this user
        return false;
      }

      // see if there's any intersection between the roles the senior can administer for this org and the roles the subordinate has for this org.
      var inCommon = _.intersection(seniorsSubordinateRolesForOrg, subordinateRolesForOrg);
      debug('isUserDescendantOfUser(' + JSON.stringify(seniorUserObj) + ',' + JSON.stringify(subordinateUserObj) + ',' + organizationName + ') => returning ' + inCommon);
      return inCommon && inCommon.length;
    }

    /**
     * Copy the given user's profile properties (as specified in roles hierarchy as profileFilters) as profile properties suitable for adding to a new user.
     * @param {object} userWithProfile - the user object, with a profile property to copy
     * @param {object} profileFilterCriteria - existing profileFilterCriteria. Note that if any properties are already specified, they may
     *  get overwritten.
     * @param {string} organizationName - the organization we're dealing with.
     * @returns {object} the query criteria, suitable for mongodb, to ensure only users with the same values for the specified fields will be returned.
     */

  }, {
    key: 'getProfileCriteriaFromUser',
    value: function getProfileCriteriaFromUser(userWithProfile, profileFilterCriteria, organizationName) {
      //TODO : copy profile filters from ALL more senior nodes in the hierarchy. As it is, we have to specify them at every level.
      var debug = this.logger.debug;
      var userRolesMap = userWithProfile.roles; // { "justice league": ["admin","hero"], "yankees": ["member"], ... }
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
          if (thisRole && thisRole.profileFilters) {
            // it might not be in our hierarchy

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
      debug('getProfileCriteriaFromUser(' + JSON.stringify(userWithProfile) + ', ' + JSON.stringify(profileFilterCriteria) + ', ' + organizationName + ') => returning ' + JSON.stringify(profileFilterCriteria));

      return profileFilterCriteria;
    }
  }], [{
    key: 'getOrganizationsForUser',
    value: function getOrganizationsForUser(myUserObj) {
      return _getOrganizationsForUser2(myUserObj);
    }
  }, {
    key: 'getRolesForUser',
    value: function getRolesForUser(user, organization) {
      return _getRolesForUser2(user, organization);
    }

    /**
     * Deprecated. Use RoleHierarchy.getRolesForUser instead.
     * @param {*} user 
     * @param {*} organization 
     */

  }, {
    key: '_getRolesForUser',
    value: function _getRolesForUser(user, organization) {
      return _getRolesForUser2(user, organization);
    }
  }]);

  return RoleHierarchy;
}(_hierarchyModel2.default);

module.exports = RoleHierarchy;