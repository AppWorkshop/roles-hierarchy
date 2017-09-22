(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("config"));
	else if(typeof define === 'function' && define.amd)
		define("role-hierarchy", ["config"], factory);
	else if(typeof exports === 'object')
		exports["role-hierarchy"] = factory(require("config"));
	else
		root["role-hierarchy"] = factory(root["config"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_12__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 4);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1,eval)("this");
} catch(e) {
	// This works if the window reference is available
	if(typeof window === "object")
		g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),
/* 1 */,
/* 2 */,
/* 3 */,
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _ = __webpack_require__(5);

var _2 = _interopRequireDefault(_);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var assert = __webpack_require__(7);
var config = __webpack_require__(12);


var whichconfig = config || new function () {
  var _this = this;

  this.getDescendantProp = function (obj, desc) {
    var arr = desc.split(".");
    while (arr.length && (obj = obj[arr.shift()])) {}
    return obj;
  };

  this.confJSON = __webpack_require__(13);

  this.get = function (key) {
    return _this.getDescendantProp(_this.confJSON, key);
  };
}();

describe('RoleHierarchy', function () {
  var roleHierarchy = void 0;

  it('get a new RoleHierarchy', function (done) {
    roleHierarchy = new _2.default({
      "hierarchy": whichconfig.get("rolesHierarchyConfig.rolesHierarchy"),
      "loggingConfig": whichconfig.get("rolesHierarchyConfig.loggingConfig"),
      "treeModelConfig": whichconfig.get("rolesHierarchyConfig.treeModelConfig")
    });
    assert.ok(roleHierarchy);
    done();
  });

  it('Find a role in the hierarchy', function (done) {
    var teacher = roleHierarchy.findRoleInHierarchy("teacher");
    assert.equal(teacher.name, "teacher", "Expected role name to be teacher");
    done();
  });

  it('getRoleSubordinate', function (done) {
    var subordinate = roleHierarchy.getRoleSubordinate('teacher', 'student');
    assert.ok(subordinate, 'Expected to get a subordinate from teacher');
    assert.equal(subordinate.name, 'student', 'Expected to get a student subordinate from teacher');
    done();
  });

  it('getAllSubordinateRolesAsArray', function (done) {
    var subordinatesArray = roleHierarchy.getAllSubordinateRolesAsArray('schoolAdmin');
    assert.ok(subordinatesArray, 'Expected to get a subordinatesArray from schoolAdmin');
    assert.deepEqual(subordinatesArray, ["teacher", "student"], "Expected ['teacher','student']");
    done();
  });

  var myUserObj = {
    _id: 'abc123',
    profile: {
      organizations: ['springfield school', 'springfield football team'],
      school: 7
    },
    "roles": {
      "springfield school": ["schoolAdmin", "footballCaptain"],
      "springfield football team": ["footballCoach"]

    }
  };

  var myStudentObj = {
    _id: 'abc123',
    profile: {
      organization: 'springfield school'
    },
    "roles": {
      "springfield school": ["student", "footballCaptain"]
    }
  };

  it('getAllUserSubordinatesAsMap', function (done) {
    var subordinatesMap = roleHierarchy.getAllUserSubordinatesAsMap(myUserObj);
    assert.ok(subordinatesMap, 'Expected to get a subordinatesMap from schoolAdmin and footballCoach');
    assert.deepEqual(subordinatesMap, {
      "springfield school": ["teacher", "student", "footballPlayer"],
      "springfield football team": ["footballCaptain", "footballPlayer"]
    }, "Unexpected subordinate results");
    done();
  });

  it('getAllMyFieldsAsObjects', function (done) {
    var fieldsObj = roleHierarchy.getAllMyFieldsAsObject(myUserObj);
    assert.ok(fieldsObj, 'Expected to get a fields Object from getAllMyFieldsAsObject');
    assert.deepEqual(fieldsObj, {
      "springfield football team": {},
      "springfield school": {
        "_id": 1,
        "emails": 1,
        "profile.name": 1,
        "roles": 1,
        "username": 1
      }
    });

    // do it for student, we shouldn't see email
    fieldsObj = roleHierarchy.getAllMyFieldsAsObject(myStudentObj);
    assert.ok(fieldsObj, 'Expected to get a fields Object from getAllMyFieldsAsObject');
    assert.deepEqual(fieldsObj, {
      "springfield school": {
        "_id": 1,
        "profile.name": 1,
        "roles": 1,
        "username": 1
      }
    });

    done();
  });

  it('isUserHasMoreSeniorRole', function (done) {
    var result = roleHierarchy.isUserHasMoreSeniorRole(myUserObj, "student", "springfield school");
    assert.ok(result, 'Expected to true');
    done();
  });

  it('isUserDescendantOfUser', function (done) {
    var result = roleHierarchy.isUserDescendantOfUser(myUserObj, myStudentObj, "springfield school");
    assert.ok(result, 'Expected true');
    result = roleHierarchy.isUserDescendantOfUser(myStudentObj, myUserObj, "springfield school"); // should be false
    assert.equal(result, false, 'Expected false');
    done();
  });

  it('getProfileCriteriaFromUser', function (done) {
    var result = roleHierarchy.getProfileCriteriaFromUser(myUserObj, {}, "springfield school");
    assert.deepEqual(result, { "profile.school": 7 });
    done();
  });
});

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(module) {var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;

var _typeof2 = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

(function webpackUniversalModuleDefinition(root, factory) {
  if (( false ? 'undefined' : _typeof2(exports)) === 'object' && ( false ? 'undefined' : _typeof2(module)) === 'object') module.exports = factory();else if (true) !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));else if ((typeof exports === 'undefined' ? 'undefined' : _typeof2(exports)) === 'object') exports["role-hierarchy"] = factory();else root["role-hierarchy"] = factory();
})(undefined, function () {
  return (/******/function (modules) {
      // webpackBootstrap
      /******/ // The module cache
      /******/var installedModules = {};
      /******/
      /******/ // The require function
      /******/function __webpack_require__(moduleId) {
        /******/
        /******/ // Check if module is in cache
        /******/if (installedModules[moduleId]) {
          /******/return installedModules[moduleId].exports;
          /******/
        }
        /******/ // Create a new module (and put it into the cache)
        /******/var module = installedModules[moduleId] = {
          /******/i: moduleId,
          /******/l: false,
          /******/exports: {}
          /******/ };
        /******/
        /******/ // Execute the module function
        /******/modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
        /******/
        /******/ // Flag the module as loaded
        /******/module.l = true;
        /******/
        /******/ // Return the exports of the module
        /******/return module.exports;
        /******/
      }
      /******/
      /******/
      /******/ // expose the modules object (__webpack_modules__)
      /******/__webpack_require__.m = modules;
      /******/
      /******/ // expose the module cache
      /******/__webpack_require__.c = installedModules;
      /******/
      /******/ // define getter function for harmony exports
      /******/__webpack_require__.d = function (exports, name, getter) {
        /******/if (!__webpack_require__.o(exports, name)) {
          /******/Object.defineProperty(exports, name, {
            /******/configurable: false,
            /******/enumerable: true,
            /******/get: getter
            /******/ });
          /******/
        }
        /******/
      };
      /******/
      /******/ // getDefaultExport function for compatibility with non-harmony modules
      /******/__webpack_require__.n = function (module) {
        /******/var getter = module && module.__esModule ?
        /******/function getDefault() {
          return module['default'];
        } :
        /******/function getModuleExports() {
          return module;
        };
        /******/__webpack_require__.d(getter, 'a', getter);
        /******/return getter;
        /******/
      };
      /******/
      /******/ // Object.prototype.hasOwnProperty.call
      /******/__webpack_require__.o = function (object, property) {
        return Object.prototype.hasOwnProperty.call(object, property);
      };
      /******/
      /******/ // __webpack_public_path__
      /******/__webpack_require__.p = "";
      /******/
      /******/ // Load entry module and return exports
      /******/return __webpack_require__(__webpack_require__.s = 1);
      /******/
    }(
    /************************************************************************/
    /******/[,
    /* 0 */
    /* 1 */
    /***/function (module, exports, __webpack_require__) {

      "use strict";

      Object.defineProperty(exports, "__esModule", {
        value: true
      });

      var _createClass = function () {
        function defineProperties(target, props) {
          for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
          }
        }return function (Constructor, protoProps, staticProps) {
          if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
        };
      }();

      var _typeof = typeof Symbol === "function" && _typeof2(Symbol.iterator) === "symbol" ? function (obj) {
        return typeof obj === 'undefined' ? 'undefined' : _typeof2(obj);
      } : function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj === 'undefined' ? 'undefined' : _typeof2(obj);
      };

      var _hierarchyModel = __webpack_require__(2);

      var _hierarchyModel2 = _interopRequireDefault(_hierarchyModel);

      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : { default: obj };
      }

      function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
          throw new TypeError("Cannot call a class as a function");
        }
      }

      function _possibleConstructorReturn(self, call) {
        if (!self) {
          throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
        }return call && ((typeof call === 'undefined' ? 'undefined' : _typeof2(call)) === "object" || typeof call === "function") ? call : self;
      }

      function _inherits(subClass, superClass) {
        if (typeof superClass !== "function" && superClass !== null) {
          throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === 'undefined' ? 'undefined' : _typeof2(superClass)));
        }subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
      }

      var _ = __webpack_require__(3);

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
         *   loggerCallback: an object that has debug, info, warn and error properties whose values are logging functions.
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

      exports.default = RoleHierarchy;

      /***/
    },
    /* 2 */
    /***/function (module, exports, __webpack_require__) {

      (function webpackUniversalModuleDefinition(root, factory) {
        if (true) module.exports = factory();else if (typeof define === 'function' && define.amd) define("hierarchy-model", [], factory);else if ((typeof exports === 'undefined' ? 'undefined' : _typeof2(exports)) === 'object') exports["hierarchy-model"] = factory();else root["hierarchy-model"] = factory();
      })(this, function () {
        return (/******/function (modules) {
            // webpackBootstrap
            /******/ // The module cache
            /******/var installedModules = {};
            /******/
            /******/ // The require function
            /******/function __webpack_require__(moduleId) {
              /******/
              /******/ // Check if module is in cache
              /******/if (installedModules[moduleId]) {
                /******/return installedModules[moduleId].exports;
                /******/
              }
              /******/ // Create a new module (and put it into the cache)
              /******/var module = installedModules[moduleId] = {
                /******/i: moduleId,
                /******/l: false,
                /******/exports: {}
                /******/ };
              /******/
              /******/ // Execute the module function
              /******/modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
              /******/
              /******/ // Flag the module as loaded
              /******/module.l = true;
              /******/
              /******/ // Return the exports of the module
              /******/return module.exports;
              /******/
            }
            /******/
            /******/
            /******/ // expose the modules object (__webpack_modules__)
            /******/__webpack_require__.m = modules;
            /******/
            /******/ // expose the module cache
            /******/__webpack_require__.c = installedModules;
            /******/
            /******/ // define getter function for harmony exports
            /******/__webpack_require__.d = function (exports, name, getter) {
              /******/if (!__webpack_require__.o(exports, name)) {
                /******/Object.defineProperty(exports, name, {
                  /******/configurable: false,
                  /******/enumerable: true,
                  /******/get: getter
                  /******/ });
                /******/
              }
              /******/
            };
            /******/
            /******/ // getDefaultExport function for compatibility with non-harmony modules
            /******/__webpack_require__.n = function (module) {
              /******/var getter = module && module.__esModule ?
              /******/function getDefault() {
                return module['default'];
              } :
              /******/function getModuleExports() {
                return module;
              };
              /******/__webpack_require__.d(getter, 'a', getter);
              /******/return getter;
              /******/
            };
            /******/
            /******/ // Object.prototype.hasOwnProperty.call
            /******/__webpack_require__.o = function (object, property) {
              return Object.prototype.hasOwnProperty.call(object, property);
            };
            /******/
            /******/ // __webpack_public_path__
            /******/__webpack_require__.p = "";
            /******/
            /******/ // Load entry module and return exports
            /******/return __webpack_require__(__webpack_require__.s = 2);
            /******/
          }(
          /************************************************************************/
          /******/[
          /* 0 */
          /***/function (module, exports) {

            // shim for using process in browser
            var process = module.exports = {};

            // cached from whatever global is present so that test runners that stub it
            // don't break things.  But we need to wrap it in a try catch in case it is
            // wrapped in strict mode code which doesn't define any globals.  It's inside a
            // function because try/catches deoptimize in certain engines.

            var cachedSetTimeout;
            var cachedClearTimeout;

            function defaultSetTimout() {
              throw new Error('setTimeout has not been defined');
            }
            function defaultClearTimeout() {
              throw new Error('clearTimeout has not been defined');
            }
            (function () {
              try {
                if (typeof setTimeout === 'function') {
                  cachedSetTimeout = setTimeout;
                } else {
                  cachedSetTimeout = defaultSetTimout;
                }
              } catch (e) {
                cachedSetTimeout = defaultSetTimout;
              }
              try {
                if (typeof clearTimeout === 'function') {
                  cachedClearTimeout = clearTimeout;
                } else {
                  cachedClearTimeout = defaultClearTimeout;
                }
              } catch (e) {
                cachedClearTimeout = defaultClearTimeout;
              }
            })();
            function runTimeout(fun) {
              if (cachedSetTimeout === setTimeout) {
                //normal enviroments in sane situations
                return setTimeout(fun, 0);
              }
              // if setTimeout wasn't available but was latter defined
              if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
                cachedSetTimeout = setTimeout;
                return setTimeout(fun, 0);
              }
              try {
                // when when somebody has screwed with setTimeout but no I.E. maddness
                return cachedSetTimeout(fun, 0);
              } catch (e) {
                try {
                  // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
                  return cachedSetTimeout.call(null, fun, 0);
                } catch (e) {
                  // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
                  return cachedSetTimeout.call(this, fun, 0);
                }
              }
            }
            function runClearTimeout(marker) {
              if (cachedClearTimeout === clearTimeout) {
                //normal enviroments in sane situations
                return clearTimeout(marker);
              }
              // if clearTimeout wasn't available but was latter defined
              if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
                cachedClearTimeout = clearTimeout;
                return clearTimeout(marker);
              }
              try {
                // when when somebody has screwed with setTimeout but no I.E. maddness
                return cachedClearTimeout(marker);
              } catch (e) {
                try {
                  // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
                  return cachedClearTimeout.call(null, marker);
                } catch (e) {
                  // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
                  // Some versions of I.E. have different rules for clearTimeout vs setTimeout
                  return cachedClearTimeout.call(this, marker);
                }
              }
            }
            var queue = [];
            var draining = false;
            var currentQueue;
            var queueIndex = -1;

            function cleanUpNextTick() {
              if (!draining || !currentQueue) {
                return;
              }
              draining = false;
              if (currentQueue.length) {
                queue = currentQueue.concat(queue);
              } else {
                queueIndex = -1;
              }
              if (queue.length) {
                drainQueue();
              }
            }

            function drainQueue() {
              if (draining) {
                return;
              }
              var timeout = runTimeout(cleanUpNextTick);
              draining = true;

              var len = queue.length;
              while (len) {
                currentQueue = queue;
                queue = [];
                while (++queueIndex < len) {
                  if (currentQueue) {
                    currentQueue[queueIndex].run();
                  }
                }
                queueIndex = -1;
                len = queue.length;
              }
              currentQueue = null;
              draining = false;
              runClearTimeout(timeout);
            }

            process.nextTick = function (fun) {
              var args = new Array(arguments.length - 1);
              if (arguments.length > 1) {
                for (var i = 1; i < arguments.length; i++) {
                  args[i - 1] = arguments[i];
                }
              }
              queue.push(new Item(fun, args));
              if (queue.length === 1 && !draining) {
                runTimeout(drainQueue);
              }
            };

            // v8 likes predictible objects
            function Item(fun, array) {
              this.fun = fun;
              this.array = array;
            }
            Item.prototype.run = function () {
              this.fun.apply(null, this.array);
            };
            process.title = 'browser';
            process.browser = true;
            process.env = {};
            process.argv = [];
            process.version = ''; // empty string to avoid regexp issues
            process.versions = {};

            function noop() {}

            process.on = noop;
            process.addListener = noop;
            process.once = noop;
            process.off = noop;
            process.removeListener = noop;
            process.removeAllListeners = noop;
            process.emit = noop;
            process.prependListener = noop;
            process.prependOnceListener = noop;

            process.listeners = function (name) {
              return [];
            };

            process.binding = function (name) {
              throw new Error('process.binding is not supported');
            };

            process.cwd = function () {
              return '/';
            };
            process.chdir = function (dir) {
              throw new Error('process.chdir is not supported');
            };
            process.umask = function () {
              return 0;
            };

            /***/
          },,
          /* 1 */
          /* 2 */
          /***/function (module, exports, __webpack_require__) {

            "use strict";
            /* WEBPACK VAR INJECTION */
            (function (process) {

              Object.defineProperty(exports, "__esModule", {
                value: true
              });

              var _createClass = function () {
                function defineProperties(target, props) {
                  for (var i = 0; i < props.length; i++) {
                    var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
                  }
                }return function (Constructor, protoProps, staticProps) {
                  if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
                };
              }();

              var _treeModel = __webpack_require__(3);

              var _treeModel2 = _interopRequireDefault(_treeModel);

              var _topiary = __webpack_require__(6);

              var _topiary2 = _interopRequireDefault(_topiary);

              var _underscore = __webpack_require__(7);

              var _underscore2 = _interopRequireDefault(_underscore);

              function _interopRequireDefault(obj) {
                return obj && obj.__esModule ? obj : { default: obj };
              }

              function _classCallCheck(instance, Constructor) {
                if (!(instance instanceof Constructor)) {
                  throw new TypeError("Cannot call a class as a function");
                }
              }

              if (process) {
                process.env.SUPPRESS_NO_CONFIG_WARNING = 'y';
              }

              var Hierarchy = function () {

                /**
                 * create a new instance of Hierarchy
                 * @param {Object} paramsObj containing a Hierarchy and a loggingConfig (optional) and a TreeModel config (optional):
                 * {
                 *   hierarchy: {"name":"teacher", "children": [ {"name":"student"} ]},
                 *   treeModelConfig: { "childrenPropertyName": "children" },
                 *   loggerCallback: an object that has debug, info, warn and error properties whose values are logging functions.
                 * }
                 */
                function Hierarchy(paramsObj) {
                  _classCallCheck(this, Hierarchy);

                  // set up config defaults
                  var treeModelConfig = paramsObj.treeModelConfig || { "childrenPropertyName": "children" };

                  this.logger = paramsObj.loggerCallback || { debug: function debug(msg) {}, info: function info(msg) {}, warn: function warn(msg) {}, error: function error(msg, err) {} };

                  this.childrenPropertyName = treeModelConfig.childrenPropertyName;

                  // actual constructor stuff here.

                  // get treeModelConfig from config
                  // we need a clone of the treeModelConfig (it doesn't work straight from node-config)
                  treeModelConfig = JSON.parse(JSON.stringify(treeModelConfig));
                  this.treeModel = new _treeModel2.default(treeModelConfig);
                  this.root = this.treeModel.parse(paramsObj.hierarchy);
                  this.logger.debug(this.getTopiaryAsString());
                }

                /**
                 * re-create the hierarchy with a new object structure.
                 * @param {Object} hierarchy 
                 */

                _createClass(Hierarchy, [{
                  key: 'reparse',
                  value: function reparse(hierarchy) {
                    this.root = this.treeModel.parse(hierarchy);
                  }
                }, {
                  key: '_findNode',
                  value: function _findNode(nodeName) {
                    var startNode = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.root;

                    return startNode.first({ strategy: 'breadth' }, function (node) {
                      return node.model.name === nodeName;
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
                   * Find the model for a node in the hierarchy, by name
                   * @param {string} nodeName - the name of the node to find (i.e. 'name' property value)
                   * @param {object} [startNode] - the node in the hierarchy to start from
                   * @returns {object} - the model of the node in the tree that matches
                   */

                }, {
                  key: 'findNodeInHierarchy',
                  value: function findNodeInHierarchy(nodeName, startNode) {
                    var result = this._findNode(nodeName, startNode);
                    if (result && result.model) {
                      this.logger.debug('findNodeInHierarchy(' + nodeName + ') => returning ' + JSON.stringify(result.model, null, 2));
                      return result.model;
                    }
                    this.logger.debug('findNodeInHierarchy(' + nodeName + ') => returning undefined');
                  }

                  /**
                   * Find the node object for a node in the hierarchy, by name
                   * @param {string} nodeName - the name of the node to find (i.e. 'name' property value)
                   * @param {object} [startNode] - the node in the hierarchy to start from
                   */

                }, {
                  key: 'findNodeObj',
                  value: function findNodeObj(nodeName, startNode) {
                    return this._findNode(nodeName, startNode);
                  }

                  /**
                   * Return the descendent node of the given nodeName if found.
                   * @param {string} nodeName - the name of the node underneath which we should search
                   * @param {string} descendantNodeName - the name of the descendant node to find
                   * @param {object} [startNode] - the node in the hierarchy to start from
                   * @returns {object} - the node of the descendant, or undefined or false if not found.
                   */

                }, {
                  key: 'findDescendantNodeByName',
                  value: function findDescendantNodeByName(nodeName, descendantNodeName, startNode) {
                    // get the node for the node name
                    var senior = this._findNode(nodeName, startNode);
                    if (!senior) {
                      return false;
                    }
                    var junior = this._findNode(descendantNodeName, senior);
                    if (junior) {
                      this.logger.debug('findDescendantNodeByName(' + nodeName + ',' + descendantNodeName + ') => returning ' + JSON.stringify(junior.model, null, 2));
                      return junior.model;
                    } else {
                      this.logger.debug('findDescendantNodeByName(' + nodeName + ') => returning undefined');
                    }
                  }

                  /**
                   * Get the names of subordinate nodes as an array
                   * @param {string} nodeName - the name of the senior node i.e. 'name' property value
                   * @param {object} [startNode] - the node in the hierarchy to start from
                   * @returns {Array} - the subordinate node names if any, otherwise undefined.
                   */

                }, {
                  key: 'getAllDescendantNodesAsArray',
                  value: function getAllDescendantNodesAsArray(nodeName, startNode) {
                    // find the node for the given node name
                    var seniorNode = this._findNode(nodeName, startNode);
                    // get all the nodes under this one
                    var result = seniorNode.all({ strategy: 'breadth' }, function (node) {
                      return node.model.name !== nodeName;
                    }).map(function (item) {
                      // get the names of each node
                      return item.model.name;
                    });
                    this.logger.debug('getAllDescendantNodesAsArray(' + nodeName + ') => returning ' + JSON.stringify(result, null, 2));
                    return result;
                  }

                  /**
                   * get a string suitable for printing, via the topiary library.
                   * @param {object} hierarchy - a Hierarchy instance
                   * @returns {string} a string representation of the hierarchy
                   */

                }, {
                  key: 'getTopiaryAsString',
                  value: function getTopiaryAsString() {
                    var hierarchy = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.root;

                    return (0, _topiary2.default)(hierarchy.model, this.childrenPropertyName);
                  }

                  /**
                   * Process each node in the tree via a callback, halting when your callback returns false.
                   * @param {function} callback a function that takes a single parameter, 'node', 
                   * which is the value of the node currently being processed. Return false from the callback to halt the traversal.
                   */

                }, {
                  key: 'walkNodes',
                  value: function walkNodes(callback) {
                    this.root.walk(callback);
                  }

                  /**
                   * Add a child to a parent.
                   * @param {Object} parentNode the node in the hierarchy to which the child should be added
                   * @param {Object} childNode a node or tree
                   * @returns {Object} the child node.
                   */

                }, {
                  key: 'addNodeAsChildOfNode',
                  value: function addNodeAsChildOfNode(parentNode, childNode) {
                    var debug = this.logger.debug;
                    debug('parentNode: ' + JSON.stringify(parentNode.model));
                    debug('childNode: ' + JSON.stringify(childNode.model));
                    return parentNode.addChild(childNode);
                  }

                  /**
                   * Get the array of Nodes representing the path from the root to this Node (inclusive).
                   * @param {Object} node 
                   * @returns {Object} the array of Nodes representing the path from the root to this Node (inclusive).
                   */

                }, {
                  key: 'getTreeModel',

                  /**
                   * get the underlying TreeModel instance
                   * @returns {Object} the underlying TreeModel instance.
                   */
                  value: function getTreeModel() {
                    return this.treeModel;
                  }

                  /**
                   * Create Node (which is itself just a TreeModel)
                   * @param {Object} paramsObj - an object which has 'name' and 'children' properties
                   */

                }, {
                  key: 'getNewNode',
                  value: function getNewNode(paramsObj) {
                    return this.treeModel.parse(paramsObj);
                  }
                }], [{
                  key: 'getPathOfNode',
                  value: function getPathOfNode(node) {
                    return node.getPath();
                  }

                  /**
                   * Get the array of Node names representing the path from the root to this Node (inclusive).
                   * @param {Object} node 
                   * @returns {Array<String>} the array of Strings representing the path from the root to this Node (inclusive).
                   */

                }, {
                  key: 'getNamesOfNodePath',
                  value: function getNamesOfNodePath(node) {
                    return _underscore2.default.map(node.getPath(), function (thisNode) {
                      return thisNode.model.name;
                    });
                  }

                  /**
                   * Drop the subtree starting at this node. Returns the node itself, which is now a root node.
                   * @param {Object} node the node in the hierarchy to drop.
                   * @returns {Object} node the node that just got dropped.
                   */

                }, {
                  key: 'deleteNodeFromHierarchy',
                  value: function deleteNodeFromHierarchy(node) {
                    return node.drop();
                  }
                }]);

                return Hierarchy;
              }();

              exports.default = Hierarchy;
              /* WEBPACK VAR INJECTION */
            }).call(exports, __webpack_require__(0));

            /***/
          },
          /* 3 */
          /***/function (module, exports, __webpack_require__) {

            var mergeSort, findInsertIndex;
            mergeSort = __webpack_require__(4);
            findInsertIndex = __webpack_require__(5);

            module.exports = function () {
              'use strict';

              var walkStrategies;

              walkStrategies = {};

              function k(result) {
                return function () {
                  return result;
                };
              }

              function TreeModel(config) {
                config = config || {};
                this.config = config;
                this.config.childrenPropertyName = config.childrenPropertyName || 'children';
                this.config.modelComparatorFn = config.modelComparatorFn;
              }

              function addChildToNode(node, child) {
                child.parent = node;
                node.children.push(child);
                return child;
              }

              function Node(config, model) {
                this.config = config;
                this.model = model;
                this.children = [];
              }

              TreeModel.prototype.parse = function (model) {
                var i, childCount, node;

                if (!(model instanceof Object)) {
                  throw new TypeError('Model must be of type object.');
                }

                node = new Node(this.config, model);
                if (model[this.config.childrenPropertyName] instanceof Array) {
                  if (this.config.modelComparatorFn) {
                    model[this.config.childrenPropertyName] = mergeSort(this.config.modelComparatorFn, model[this.config.childrenPropertyName]);
                  }
                  for (i = 0, childCount = model[this.config.childrenPropertyName].length; i < childCount; i++) {
                    addChildToNode(node, this.parse(model[this.config.childrenPropertyName][i]));
                  }
                }
                return node;
              };

              function hasComparatorFunction(node) {
                return typeof node.config.modelComparatorFn === 'function';
              }

              Node.prototype.isRoot = function () {
                return this.parent === undefined;
              };

              Node.prototype.hasChildren = function () {
                return this.children.length > 0;
              };

              function addChild(self, child, insertIndex) {
                var index;

                if (!(child instanceof Node)) {
                  throw new TypeError('Child must be of type Node.');
                }

                child.parent = self;
                if (!(self.model[self.config.childrenPropertyName] instanceof Array)) {
                  self.model[self.config.childrenPropertyName] = [];
                }

                if (hasComparatorFunction(self)) {
                  // Find the index to insert the child
                  index = findInsertIndex(self.config.modelComparatorFn, self.model[self.config.childrenPropertyName], child.model);

                  // Add to the model children
                  self.model[self.config.childrenPropertyName].splice(index, 0, child.model);

                  // Add to the node children
                  self.children.splice(index, 0, child);
                } else {
                  if (insertIndex === undefined) {
                    self.model[self.config.childrenPropertyName].push(child.model);
                    self.children.push(child);
                  } else {
                    if (insertIndex < 0 || insertIndex > self.children.length) {
                      throw new Error('Invalid index.');
                    }
                    self.model[self.config.childrenPropertyName].splice(insertIndex, 0, child.model);
                    self.children.splice(insertIndex, 0, child);
                  }
                }
                return child;
              }

              Node.prototype.addChild = function (child) {
                return addChild(this, child);
              };

              Node.prototype.addChildAtIndex = function (child, index) {
                if (hasComparatorFunction(this)) {
                  throw new Error('Cannot add child at index when using a comparator function.');
                }

                return addChild(this, child, index);
              };

              Node.prototype.setIndex = function (index) {
                if (hasComparatorFunction(this)) {
                  throw new Error('Cannot set node index when using a comparator function.');
                }

                if (this.isRoot()) {
                  if (index === 0) {
                    return this;
                  }
                  throw new Error('Invalid index.');
                }

                if (index < 0 || index >= this.parent.children.length) {
                  throw new Error('Invalid index.');
                }

                var oldIndex = this.parent.children.indexOf(this);

                this.parent.children.splice(index, 0, this.parent.children.splice(oldIndex, 1)[0]);

                this.parent.model[this.parent.config.childrenPropertyName].splice(index, 0, this.parent.model[this.parent.config.childrenPropertyName].splice(oldIndex, 1)[0]);

                return this;
              };

              Node.prototype.getPath = function () {
                var path = [];
                (function addToPath(node) {
                  path.unshift(node);
                  if (!node.isRoot()) {
                    addToPath(node.parent);
                  }
                })(this);
                return path;
              };

              Node.prototype.getIndex = function () {
                if (this.isRoot()) {
                  return 0;
                }
                return this.parent.children.indexOf(this);
              };

              /**
               * Parse the arguments of traversal functions. These functions can take one optional
               * first argument which is an options object. If present, this object will be stored
               * in args.options. The only mandatory argument is the callback function which can
               * appear in the first or second position (if an options object is given). This
               * function will be saved to args.fn. The last optional argument is the context on
               * which the callback function will be called. It will be available in args.ctx.
               *
               * @returns Parsed arguments.
               */
              function parseArgs() {
                var args = {};
                if (arguments.length === 1) {
                  if (typeof arguments[0] === 'function') {
                    args.fn = arguments[0];
                  } else {
                    args.options = arguments[0];
                  }
                } else if (arguments.length === 2) {
                  if (typeof arguments[0] === 'function') {
                    args.fn = arguments[0];
                    args.ctx = arguments[1];
                  } else {
                    args.options = arguments[0];
                    args.fn = arguments[1];
                  }
                } else {
                  args.options = arguments[0];
                  args.fn = arguments[1];
                  args.ctx = arguments[2];
                }
                args.options = args.options || {};
                if (!args.options.strategy) {
                  args.options.strategy = 'pre';
                }
                if (!walkStrategies[args.options.strategy]) {
                  throw new Error('Unknown tree walk strategy. Valid strategies are \'pre\' [default], \'post\' and \'breadth\'.');
                }
                return args;
              }

              Node.prototype.walk = function () {
                var args;
                args = parseArgs.apply(this, arguments);
                walkStrategies[args.options.strategy].call(this, args.fn, args.ctx);
              };

              walkStrategies.pre = function depthFirstPreOrder(callback, context) {
                var i, childCount, keepGoing;
                keepGoing = callback.call(context, this);
                for (i = 0, childCount = this.children.length; i < childCount; i++) {
                  if (keepGoing === false) {
                    return false;
                  }
                  keepGoing = depthFirstPreOrder.call(this.children[i], callback, context);
                }
                return keepGoing;
              };

              walkStrategies.post = function depthFirstPostOrder(callback, context) {
                var i, childCount, keepGoing;
                for (i = 0, childCount = this.children.length; i < childCount; i++) {
                  keepGoing = depthFirstPostOrder.call(this.children[i], callback, context);
                  if (keepGoing === false) {
                    return false;
                  }
                }
                keepGoing = callback.call(context, this);
                return keepGoing;
              };

              walkStrategies.breadth = function breadthFirst(callback, context) {
                var queue = [this];
                (function processQueue() {
                  var i, childCount, node;
                  if (queue.length === 0) {
                    return;
                  }
                  node = queue.shift();
                  for (i = 0, childCount = node.children.length; i < childCount; i++) {
                    queue.push(node.children[i]);
                  }
                  if (callback.call(context, node) !== false) {
                    processQueue();
                  }
                })();
              };

              Node.prototype.all = function () {
                var args,
                    all = [];
                args = parseArgs.apply(this, arguments);
                args.fn = args.fn || k(true);
                walkStrategies[args.options.strategy].call(this, function (node) {
                  if (args.fn.call(args.ctx, node)) {
                    all.push(node);
                  }
                }, args.ctx);
                return all;
              };

              Node.prototype.first = function () {
                var args, first;
                args = parseArgs.apply(this, arguments);
                args.fn = args.fn || k(true);
                walkStrategies[args.options.strategy].call(this, function (node) {
                  if (args.fn.call(args.ctx, node)) {
                    first = node;
                    return false;
                  }
                }, args.ctx);
                return first;
              };

              Node.prototype.drop = function () {
                var indexOfChild;
                if (!this.isRoot()) {
                  indexOfChild = this.parent.children.indexOf(this);
                  this.parent.children.splice(indexOfChild, 1);
                  this.parent.model[this.config.childrenPropertyName].splice(indexOfChild, 1);
                  this.parent = undefined;
                  delete this.parent;
                }
                return this;
              };

              return TreeModel;
            }();

            /***/
          },
          /* 4 */
          /***/function (module, exports) {

            module.exports = function () {
              'use strict';

              /**
               * Sort an array using the merge sort algorithm.
               *
               * @param {function} comparatorFn The comparator function.
               * @param {array} arr The array to sort.
               * @returns {array} The sorted array.
               */

              function mergeSort(comparatorFn, arr) {
                var len = arr.length,
                    firstHalf,
                    secondHalf;
                if (len >= 2) {
                  firstHalf = arr.slice(0, len / 2);
                  secondHalf = arr.slice(len / 2, len);
                  return merge(comparatorFn, mergeSort(comparatorFn, firstHalf), mergeSort(comparatorFn, secondHalf));
                } else {
                  return arr.slice();
                }
              }

              /**
               * The merge part of the merge sort algorithm.
               *
               * @param {function} comparatorFn The comparator function.
               * @param {array} arr1 The first sorted array.
               * @param {array} arr2 The second sorted array.
               * @returns {array} The merged and sorted array.
               */
              function merge(comparatorFn, arr1, arr2) {
                var result = [],
                    left1 = arr1.length,
                    left2 = arr2.length;
                while (left1 > 0 && left2 > 0) {
                  if (comparatorFn(arr1[0], arr2[0]) <= 0) {
                    result.push(arr1.shift());
                    left1--;
                  } else {
                    result.push(arr2.shift());
                    left2--;
                  }
                }
                if (left1 > 0) {
                  result.push.apply(result, arr1);
                } else {
                  result.push.apply(result, arr2);
                }
                return result;
              }

              return mergeSort;
            }();

            /***/
          },
          /* 5 */
          /***/function (module, exports) {

            module.exports = function () {
              'use strict';

              /**
               * Find the index to insert an element in array keeping the sort order.
               *
               * @param {function} comparatorFn The comparator function which sorted the array.
               * @param {array} arr The sorted array.
               * @param {object} el The element to insert.
               */

              function findInsertIndex(comparatorFn, arr, el) {
                var i, len;
                for (i = 0, len = arr.length; i < len; i++) {
                  if (comparatorFn(arr[i], el) > 0) {
                    break;
                  }
                }
                return i;
              }

              return findInsertIndex;
            }();

            /***/
          },
          /* 6 */
          /***/function (module, exports) {

            module.exports = function (tree, recurseName, opts) {
              opts = opts || {};
              var nameFn = opts.name || function (e) {
                return e.name;
              };
              var filterFn = opts.filter || function () {
                return true;
              };
              var sortFn = !opts.sort ? null : function (x, y) {
                return nameFn(x).localeCompare(nameFn(y));
              };

              var lines = [nameFn(tree)];
              if (!Array.isArray(tree[recurseName])) {
                throw new Error("No recurse entry for '" + recurseName + "' found on root");
              }

              var recurse = function recurse(xs, level, parentAry) {
                var ys = sortFn instanceof Function ? xs.sort(sortFn) : xs;
                ys.forEach(function (sub, idx, subAry) {
                  var children = (sub[recurseName] || []).filter(filterFn),
                      hasChildren = children.length > 0,
                      forkChar = hasChildren ? "┬" : "─",
                      isLast = idx === subAry.length - 1,
                      turnChar = isLast ? "└" : "├",
                      indent = '';

                  for (var i = 0; i < level; i += 1) {
                    indent += (parentAry[i] ? " " : "│") + " ";
                  }

                  lines.push(" " + indent + turnChar + "─" + forkChar + nameFn(sub));

                  if (hasChildren) {
                    // recurse into current tree while keeping track of parent lines
                    recurse(children, level + 1, parentAry.concat(isLast));
                  }
                });
              };
              recurse(tree[recurseName].filter(filterFn), 0, []);
              return lines.join('\n');
            };

            /***/
          },
          /* 7 */
          /***/function (module, exports, __webpack_require__) {

            var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__; //     Underscore.js 1.8.3
            //     http://underscorejs.org
            //     (c) 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
            //     Underscore may be freely distributed under the MIT license.

            (function () {

              // Baseline setup
              // --------------

              // Establish the root object, `window` in the browser, or `exports` on the server.
              var root = this;

              // Save the previous value of the `_` variable.
              var previousUnderscore = root._;

              // Save bytes in the minified (but not gzipped) version:
              var ArrayProto = Array.prototype,
                  ObjProto = Object.prototype,
                  FuncProto = Function.prototype;

              // Create quick reference variables for speed access to core prototypes.
              var push = ArrayProto.push,
                  slice = ArrayProto.slice,
                  toString = ObjProto.toString,
                  hasOwnProperty = ObjProto.hasOwnProperty;

              // All **ECMAScript 5** native function implementations that we hope to use
              // are declared here.
              var nativeIsArray = Array.isArray,
                  nativeKeys = Object.keys,
                  nativeBind = FuncProto.bind,
                  nativeCreate = Object.create;

              // Naked function reference for surrogate-prototype-swapping.
              var Ctor = function Ctor() {};

              // Create a safe reference to the Underscore object for use below.
              var _ = function _(obj) {
                if (obj instanceof _) return obj;
                if (!(this instanceof _)) return new _(obj);
                this._wrapped = obj;
              };

              // Export the Underscore object for **Node.js**, with
              // backwards-compatibility for the old `require()` API. If we're in
              // the browser, add `_` as a global object.
              if (true) {
                if (typeof module !== 'undefined' && module.exports) {
                  exports = module.exports = _;
                }
                exports._ = _;
              } else {
                root._ = _;
              }

              // Current version.
              _.VERSION = '1.8.3';

              // Internal function that returns an efficient (for current engines) version
              // of the passed-in callback, to be repeatedly applied in other Underscore
              // functions.
              var optimizeCb = function optimizeCb(func, context, argCount) {
                if (context === void 0) return func;
                switch (argCount == null ? 3 : argCount) {
                  case 1:
                    return function (value) {
                      return func.call(context, value);
                    };
                  case 2:
                    return function (value, other) {
                      return func.call(context, value, other);
                    };
                  case 3:
                    return function (value, index, collection) {
                      return func.call(context, value, index, collection);
                    };
                  case 4:
                    return function (accumulator, value, index, collection) {
                      return func.call(context, accumulator, value, index, collection);
                    };
                }
                return function () {
                  return func.apply(context, arguments);
                };
              };

              // A mostly-internal function to generate callbacks that can be applied
              // to each element in a collection, returning the desired result — either
              // identity, an arbitrary callback, a property matcher, or a property accessor.
              var cb = function cb(value, context, argCount) {
                if (value == null) return _.identity;
                if (_.isFunction(value)) return optimizeCb(value, context, argCount);
                if (_.isObject(value)) return _.matcher(value);
                return _.property(value);
              };
              _.iteratee = function (value, context) {
                return cb(value, context, Infinity);
              };

              // An internal function for creating assigner functions.
              var createAssigner = function createAssigner(keysFunc, undefinedOnly) {
                return function (obj) {
                  var length = arguments.length;
                  if (length < 2 || obj == null) return obj;
                  for (var index = 1; index < length; index++) {
                    var source = arguments[index],
                        keys = keysFunc(source),
                        l = keys.length;
                    for (var i = 0; i < l; i++) {
                      var key = keys[i];
                      if (!undefinedOnly || obj[key] === void 0) obj[key] = source[key];
                    }
                  }
                  return obj;
                };
              };

              // An internal function for creating a new object that inherits from another.
              var baseCreate = function baseCreate(prototype) {
                if (!_.isObject(prototype)) return {};
                if (nativeCreate) return nativeCreate(prototype);
                Ctor.prototype = prototype;
                var result = new Ctor();
                Ctor.prototype = null;
                return result;
              };

              var property = function property(key) {
                return function (obj) {
                  return obj == null ? void 0 : obj[key];
                };
              };

              // Helper for collection methods to determine whether a collection
              // should be iterated as an array or as an object
              // Related: http://people.mozilla.org/~jorendorff/es6-draft.html#sec-tolength
              // Avoids a very nasty iOS 8 JIT bug on ARM-64. #2094
              var MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;
              var getLength = property('length');
              var isArrayLike = function isArrayLike(collection) {
                var length = getLength(collection);
                return typeof length == 'number' && length >= 0 && length <= MAX_ARRAY_INDEX;
              };

              // Collection Functions
              // --------------------

              // The cornerstone, an `each` implementation, aka `forEach`.
              // Handles raw objects in addition to array-likes. Treats all
              // sparse array-likes as if they were dense.
              _.each = _.forEach = function (obj, iteratee, context) {
                iteratee = optimizeCb(iteratee, context);
                var i, length;
                if (isArrayLike(obj)) {
                  for (i = 0, length = obj.length; i < length; i++) {
                    iteratee(obj[i], i, obj);
                  }
                } else {
                  var keys = _.keys(obj);
                  for (i = 0, length = keys.length; i < length; i++) {
                    iteratee(obj[keys[i]], keys[i], obj);
                  }
                }
                return obj;
              };

              // Return the results of applying the iteratee to each element.
              _.map = _.collect = function (obj, iteratee, context) {
                iteratee = cb(iteratee, context);
                var keys = !isArrayLike(obj) && _.keys(obj),
                    length = (keys || obj).length,
                    results = Array(length);
                for (var index = 0; index < length; index++) {
                  var currentKey = keys ? keys[index] : index;
                  results[index] = iteratee(obj[currentKey], currentKey, obj);
                }
                return results;
              };

              // Create a reducing function iterating left or right.
              function createReduce(dir) {
                // Optimized iterator function as using arguments.length
                // in the main function will deoptimize the, see #1991.
                function iterator(obj, iteratee, memo, keys, index, length) {
                  for (; index >= 0 && index < length; index += dir) {
                    var currentKey = keys ? keys[index] : index;
                    memo = iteratee(memo, obj[currentKey], currentKey, obj);
                  }
                  return memo;
                }

                return function (obj, iteratee, memo, context) {
                  iteratee = optimizeCb(iteratee, context, 4);
                  var keys = !isArrayLike(obj) && _.keys(obj),
                      length = (keys || obj).length,
                      index = dir > 0 ? 0 : length - 1;
                  // Determine the initial value if none is provided.
                  if (arguments.length < 3) {
                    memo = obj[keys ? keys[index] : index];
                    index += dir;
                  }
                  return iterator(obj, iteratee, memo, keys, index, length);
                };
              }

              // **Reduce** builds up a single result from a list of values, aka `inject`,
              // or `foldl`.
              _.reduce = _.foldl = _.inject = createReduce(1);

              // The right-associative version of reduce, also known as `foldr`.
              _.reduceRight = _.foldr = createReduce(-1);

              // Return the first value which passes a truth test. Aliased as `detect`.
              _.find = _.detect = function (obj, predicate, context) {
                var key;
                if (isArrayLike(obj)) {
                  key = _.findIndex(obj, predicate, context);
                } else {
                  key = _.findKey(obj, predicate, context);
                }
                if (key !== void 0 && key !== -1) return obj[key];
              };

              // Return all the elements that pass a truth test.
              // Aliased as `select`.
              _.filter = _.select = function (obj, predicate, context) {
                var results = [];
                predicate = cb(predicate, context);
                _.each(obj, function (value, index, list) {
                  if (predicate(value, index, list)) results.push(value);
                });
                return results;
              };

              // Return all the elements for which a truth test fails.
              _.reject = function (obj, predicate, context) {
                return _.filter(obj, _.negate(cb(predicate)), context);
              };

              // Determine whether all of the elements match a truth test.
              // Aliased as `all`.
              _.every = _.all = function (obj, predicate, context) {
                predicate = cb(predicate, context);
                var keys = !isArrayLike(obj) && _.keys(obj),
                    length = (keys || obj).length;
                for (var index = 0; index < length; index++) {
                  var currentKey = keys ? keys[index] : index;
                  if (!predicate(obj[currentKey], currentKey, obj)) return false;
                }
                return true;
              };

              // Determine if at least one element in the object matches a truth test.
              // Aliased as `any`.
              _.some = _.any = function (obj, predicate, context) {
                predicate = cb(predicate, context);
                var keys = !isArrayLike(obj) && _.keys(obj),
                    length = (keys || obj).length;
                for (var index = 0; index < length; index++) {
                  var currentKey = keys ? keys[index] : index;
                  if (predicate(obj[currentKey], currentKey, obj)) return true;
                }
                return false;
              };

              // Determine if the array or object contains a given item (using `===`).
              // Aliased as `includes` and `include`.
              _.contains = _.includes = _.include = function (obj, item, fromIndex, guard) {
                if (!isArrayLike(obj)) obj = _.values(obj);
                if (typeof fromIndex != 'number' || guard) fromIndex = 0;
                return _.indexOf(obj, item, fromIndex) >= 0;
              };

              // Invoke a method (with arguments) on every item in a collection.
              _.invoke = function (obj, method) {
                var args = slice.call(arguments, 2);
                var isFunc = _.isFunction(method);
                return _.map(obj, function (value) {
                  var func = isFunc ? method : value[method];
                  return func == null ? func : func.apply(value, args);
                });
              };

              // Convenience version of a common use case of `map`: fetching a property.
              _.pluck = function (obj, key) {
                return _.map(obj, _.property(key));
              };

              // Convenience version of a common use case of `filter`: selecting only objects
              // containing specific `key:value` pairs.
              _.where = function (obj, attrs) {
                return _.filter(obj, _.matcher(attrs));
              };

              // Convenience version of a common use case of `find`: getting the first object
              // containing specific `key:value` pairs.
              _.findWhere = function (obj, attrs) {
                return _.find(obj, _.matcher(attrs));
              };

              // Return the maximum element (or element-based computation).
              _.max = function (obj, iteratee, context) {
                var result = -Infinity,
                    lastComputed = -Infinity,
                    value,
                    computed;
                if (iteratee == null && obj != null) {
                  obj = isArrayLike(obj) ? obj : _.values(obj);
                  for (var i = 0, length = obj.length; i < length; i++) {
                    value = obj[i];
                    if (value > result) {
                      result = value;
                    }
                  }
                } else {
                  iteratee = cb(iteratee, context);
                  _.each(obj, function (value, index, list) {
                    computed = iteratee(value, index, list);
                    if (computed > lastComputed || computed === -Infinity && result === -Infinity) {
                      result = value;
                      lastComputed = computed;
                    }
                  });
                }
                return result;
              };

              // Return the minimum element (or element-based computation).
              _.min = function (obj, iteratee, context) {
                var result = Infinity,
                    lastComputed = Infinity,
                    value,
                    computed;
                if (iteratee == null && obj != null) {
                  obj = isArrayLike(obj) ? obj : _.values(obj);
                  for (var i = 0, length = obj.length; i < length; i++) {
                    value = obj[i];
                    if (value < result) {
                      result = value;
                    }
                  }
                } else {
                  iteratee = cb(iteratee, context);
                  _.each(obj, function (value, index, list) {
                    computed = iteratee(value, index, list);
                    if (computed < lastComputed || computed === Infinity && result === Infinity) {
                      result = value;
                      lastComputed = computed;
                    }
                  });
                }
                return result;
              };

              // Shuffle a collection, using the modern version of the
              // [Fisher-Yates shuffle](http://en.wikipedia.org/wiki/Fisher–Yates_shuffle).
              _.shuffle = function (obj) {
                var set = isArrayLike(obj) ? obj : _.values(obj);
                var length = set.length;
                var shuffled = Array(length);
                for (var index = 0, rand; index < length; index++) {
                  rand = _.random(0, index);
                  if (rand !== index) shuffled[index] = shuffled[rand];
                  shuffled[rand] = set[index];
                }
                return shuffled;
              };

              // Sample **n** random values from a collection.
              // If **n** is not specified, returns a single random element.
              // The internal `guard` argument allows it to work with `map`.
              _.sample = function (obj, n, guard) {
                if (n == null || guard) {
                  if (!isArrayLike(obj)) obj = _.values(obj);
                  return obj[_.random(obj.length - 1)];
                }
                return _.shuffle(obj).slice(0, Math.max(0, n));
              };

              // Sort the object's values by a criterion produced by an iteratee.
              _.sortBy = function (obj, iteratee, context) {
                iteratee = cb(iteratee, context);
                return _.pluck(_.map(obj, function (value, index, list) {
                  return {
                    value: value,
                    index: index,
                    criteria: iteratee(value, index, list)
                  };
                }).sort(function (left, right) {
                  var a = left.criteria;
                  var b = right.criteria;
                  if (a !== b) {
                    if (a > b || a === void 0) return 1;
                    if (a < b || b === void 0) return -1;
                  }
                  return left.index - right.index;
                }), 'value');
              };

              // An internal function used for aggregate "group by" operations.
              var group = function group(behavior) {
                return function (obj, iteratee, context) {
                  var result = {};
                  iteratee = cb(iteratee, context);
                  _.each(obj, function (value, index) {
                    var key = iteratee(value, index, obj);
                    behavior(result, value, key);
                  });
                  return result;
                };
              };

              // Groups the object's values by a criterion. Pass either a string attribute
              // to group by, or a function that returns the criterion.
              _.groupBy = group(function (result, value, key) {
                if (_.has(result, key)) result[key].push(value);else result[key] = [value];
              });

              // Indexes the object's values by a criterion, similar to `groupBy`, but for
              // when you know that your index values will be unique.
              _.indexBy = group(function (result, value, key) {
                result[key] = value;
              });

              // Counts instances of an object that group by a certain criterion. Pass
              // either a string attribute to count by, or a function that returns the
              // criterion.
              _.countBy = group(function (result, value, key) {
                if (_.has(result, key)) result[key]++;else result[key] = 1;
              });

              // Safely create a real, live array from anything iterable.
              _.toArray = function (obj) {
                if (!obj) return [];
                if (_.isArray(obj)) return slice.call(obj);
                if (isArrayLike(obj)) return _.map(obj, _.identity);
                return _.values(obj);
              };

              // Return the number of elements in an object.
              _.size = function (obj) {
                if (obj == null) return 0;
                return isArrayLike(obj) ? obj.length : _.keys(obj).length;
              };

              // Split a collection into two arrays: one whose elements all satisfy the given
              // predicate, and one whose elements all do not satisfy the predicate.
              _.partition = function (obj, predicate, context) {
                predicate = cb(predicate, context);
                var pass = [],
                    fail = [];
                _.each(obj, function (value, key, obj) {
                  (predicate(value, key, obj) ? pass : fail).push(value);
                });
                return [pass, fail];
              };

              // Array Functions
              // ---------------

              // Get the first element of an array. Passing **n** will return the first N
              // values in the array. Aliased as `head` and `take`. The **guard** check
              // allows it to work with `_.map`.
              _.first = _.head = _.take = function (array, n, guard) {
                if (array == null) return void 0;
                if (n == null || guard) return array[0];
                return _.initial(array, array.length - n);
              };

              // Returns everything but the last entry of the array. Especially useful on
              // the arguments object. Passing **n** will return all the values in
              // the array, excluding the last N.
              _.initial = function (array, n, guard) {
                return slice.call(array, 0, Math.max(0, array.length - (n == null || guard ? 1 : n)));
              };

              // Get the last element of an array. Passing **n** will return the last N
              // values in the array.
              _.last = function (array, n, guard) {
                if (array == null) return void 0;
                if (n == null || guard) return array[array.length - 1];
                return _.rest(array, Math.max(0, array.length - n));
              };

              // Returns everything but the first entry of the array. Aliased as `tail` and `drop`.
              // Especially useful on the arguments object. Passing an **n** will return
              // the rest N values in the array.
              _.rest = _.tail = _.drop = function (array, n, guard) {
                return slice.call(array, n == null || guard ? 1 : n);
              };

              // Trim out all falsy values from an array.
              _.compact = function (array) {
                return _.filter(array, _.identity);
              };

              // Internal implementation of a recursive `flatten` function.
              var flatten = function flatten(input, shallow, strict, startIndex) {
                var output = [],
                    idx = 0;
                for (var i = startIndex || 0, length = getLength(input); i < length; i++) {
                  var value = input[i];
                  if (isArrayLike(value) && (_.isArray(value) || _.isArguments(value))) {
                    //flatten current level of array or arguments object
                    if (!shallow) value = flatten(value, shallow, strict);
                    var j = 0,
                        len = value.length;
                    output.length += len;
                    while (j < len) {
                      output[idx++] = value[j++];
                    }
                  } else if (!strict) {
                    output[idx++] = value;
                  }
                }
                return output;
              };

              // Flatten out an array, either recursively (by default), or just one level.
              _.flatten = function (array, shallow) {
                return flatten(array, shallow, false);
              };

              // Return a version of the array that does not contain the specified value(s).
              _.without = function (array) {
                return _.difference(array, slice.call(arguments, 1));
              };

              // Produce a duplicate-free version of the array. If the array has already
              // been sorted, you have the option of using a faster algorithm.
              // Aliased as `unique`.
              _.uniq = _.unique = function (array, isSorted, iteratee, context) {
                if (!_.isBoolean(isSorted)) {
                  context = iteratee;
                  iteratee = isSorted;
                  isSorted = false;
                }
                if (iteratee != null) iteratee = cb(iteratee, context);
                var result = [];
                var seen = [];
                for (var i = 0, length = getLength(array); i < length; i++) {
                  var value = array[i],
                      computed = iteratee ? iteratee(value, i, array) : value;
                  if (isSorted) {
                    if (!i || seen !== computed) result.push(value);
                    seen = computed;
                  } else if (iteratee) {
                    if (!_.contains(seen, computed)) {
                      seen.push(computed);
                      result.push(value);
                    }
                  } else if (!_.contains(result, value)) {
                    result.push(value);
                  }
                }
                return result;
              };

              // Produce an array that contains the union: each distinct element from all of
              // the passed-in arrays.
              _.union = function () {
                return _.uniq(flatten(arguments, true, true));
              };

              // Produce an array that contains every item shared between all the
              // passed-in arrays.
              _.intersection = function (array) {
                var result = [];
                var argsLength = arguments.length;
                for (var i = 0, length = getLength(array); i < length; i++) {
                  var item = array[i];
                  if (_.contains(result, item)) continue;
                  for (var j = 1; j < argsLength; j++) {
                    if (!_.contains(arguments[j], item)) break;
                  }
                  if (j === argsLength) result.push(item);
                }
                return result;
              };

              // Take the difference between one array and a number of other arrays.
              // Only the elements present in just the first array will remain.
              _.difference = function (array) {
                var rest = flatten(arguments, true, true, 1);
                return _.filter(array, function (value) {
                  return !_.contains(rest, value);
                });
              };

              // Zip together multiple lists into a single array -- elements that share
              // an index go together.
              _.zip = function () {
                return _.unzip(arguments);
              };

              // Complement of _.zip. Unzip accepts an array of arrays and groups
              // each array's elements on shared indices
              _.unzip = function (array) {
                var length = array && _.max(array, getLength).length || 0;
                var result = Array(length);

                for (var index = 0; index < length; index++) {
                  result[index] = _.pluck(array, index);
                }
                return result;
              };

              // Converts lists into objects. Pass either a single array of `[key, value]`
              // pairs, or two parallel arrays of the same length -- one of keys, and one of
              // the corresponding values.
              _.object = function (list, values) {
                var result = {};
                for (var i = 0, length = getLength(list); i < length; i++) {
                  if (values) {
                    result[list[i]] = values[i];
                  } else {
                    result[list[i][0]] = list[i][1];
                  }
                }
                return result;
              };

              // Generator function to create the findIndex and findLastIndex functions
              function createPredicateIndexFinder(dir) {
                return function (array, predicate, context) {
                  predicate = cb(predicate, context);
                  var length = getLength(array);
                  var index = dir > 0 ? 0 : length - 1;
                  for (; index >= 0 && index < length; index += dir) {
                    if (predicate(array[index], index, array)) return index;
                  }
                  return -1;
                };
              }

              // Returns the first index on an array-like that passes a predicate test
              _.findIndex = createPredicateIndexFinder(1);
              _.findLastIndex = createPredicateIndexFinder(-1);

              // Use a comparator function to figure out the smallest index at which
              // an object should be inserted so as to maintain order. Uses binary search.
              _.sortedIndex = function (array, obj, iteratee, context) {
                iteratee = cb(iteratee, context, 1);
                var value = iteratee(obj);
                var low = 0,
                    high = getLength(array);
                while (low < high) {
                  var mid = Math.floor((low + high) / 2);
                  if (iteratee(array[mid]) < value) low = mid + 1;else high = mid;
                }
                return low;
              };

              // Generator function to create the indexOf and lastIndexOf functions
              function createIndexFinder(dir, predicateFind, sortedIndex) {
                return function (array, item, idx) {
                  var i = 0,
                      length = getLength(array);
                  if (typeof idx == 'number') {
                    if (dir > 0) {
                      i = idx >= 0 ? idx : Math.max(idx + length, i);
                    } else {
                      length = idx >= 0 ? Math.min(idx + 1, length) : idx + length + 1;
                    }
                  } else if (sortedIndex && idx && length) {
                    idx = sortedIndex(array, item);
                    return array[idx] === item ? idx : -1;
                  }
                  if (item !== item) {
                    idx = predicateFind(slice.call(array, i, length), _.isNaN);
                    return idx >= 0 ? idx + i : -1;
                  }
                  for (idx = dir > 0 ? i : length - 1; idx >= 0 && idx < length; idx += dir) {
                    if (array[idx] === item) return idx;
                  }
                  return -1;
                };
              }

              // Return the position of the first occurrence of an item in an array,
              // or -1 if the item is not included in the array.
              // If the array is large and already in sort order, pass `true`
              // for **isSorted** to use binary search.
              _.indexOf = createIndexFinder(1, _.findIndex, _.sortedIndex);
              _.lastIndexOf = createIndexFinder(-1, _.findLastIndex);

              // Generate an integer Array containing an arithmetic progression. A port of
              // the native Python `range()` function. See
              // [the Python documentation](http://docs.python.org/library/functions.html#range).
              _.range = function (start, stop, step) {
                if (stop == null) {
                  stop = start || 0;
                  start = 0;
                }
                step = step || 1;

                var length = Math.max(Math.ceil((stop - start) / step), 0);
                var range = Array(length);

                for (var idx = 0; idx < length; idx++, start += step) {
                  range[idx] = start;
                }

                return range;
              };

              // Function (ahem) Functions
              // ------------------

              // Determines whether to execute a function as a constructor
              // or a normal function with the provided arguments
              var executeBound = function executeBound(sourceFunc, boundFunc, context, callingContext, args) {
                if (!(callingContext instanceof boundFunc)) return sourceFunc.apply(context, args);
                var self = baseCreate(sourceFunc.prototype);
                var result = sourceFunc.apply(self, args);
                if (_.isObject(result)) return result;
                return self;
              };

              // Create a function bound to a given object (assigning `this`, and arguments,
              // optionally). Delegates to **ECMAScript 5**'s native `Function.bind` if
              // available.
              _.bind = function (func, context) {
                if (nativeBind && func.bind === nativeBind) return nativeBind.apply(func, slice.call(arguments, 1));
                if (!_.isFunction(func)) throw new TypeError('Bind must be called on a function');
                var args = slice.call(arguments, 2);
                var bound = function bound() {
                  return executeBound(func, bound, context, this, args.concat(slice.call(arguments)));
                };
                return bound;
              };

              // Partially apply a function by creating a version that has had some of its
              // arguments pre-filled, without changing its dynamic `this` context. _ acts
              // as a placeholder, allowing any combination of arguments to be pre-filled.
              _.partial = function (func) {
                var boundArgs = slice.call(arguments, 1);
                var bound = function bound() {
                  var position = 0,
                      length = boundArgs.length;
                  var args = Array(length);
                  for (var i = 0; i < length; i++) {
                    args[i] = boundArgs[i] === _ ? arguments[position++] : boundArgs[i];
                  }
                  while (position < arguments.length) {
                    args.push(arguments[position++]);
                  }return executeBound(func, bound, this, this, args);
                };
                return bound;
              };

              // Bind a number of an object's methods to that object. Remaining arguments
              // are the method names to be bound. Useful for ensuring that all callbacks
              // defined on an object belong to it.
              _.bindAll = function (obj) {
                var i,
                    length = arguments.length,
                    key;
                if (length <= 1) throw new Error('bindAll must be passed function names');
                for (i = 1; i < length; i++) {
                  key = arguments[i];
                  obj[key] = _.bind(obj[key], obj);
                }
                return obj;
              };

              // Memoize an expensive function by storing its results.
              _.memoize = function (func, hasher) {
                var memoize = function memoize(key) {
                  var cache = memoize.cache;
                  var address = '' + (hasher ? hasher.apply(this, arguments) : key);
                  if (!_.has(cache, address)) cache[address] = func.apply(this, arguments);
                  return cache[address];
                };
                memoize.cache = {};
                return memoize;
              };

              // Delays a function for the given number of milliseconds, and then calls
              // it with the arguments supplied.
              _.delay = function (func, wait) {
                var args = slice.call(arguments, 2);
                return setTimeout(function () {
                  return func.apply(null, args);
                }, wait);
              };

              // Defers a function, scheduling it to run after the current call stack has
              // cleared.
              _.defer = _.partial(_.delay, _, 1);

              // Returns a function, that, when invoked, will only be triggered at most once
              // during a given window of time. Normally, the throttled function will run
              // as much as it can, without ever going more than once per `wait` duration;
              // but if you'd like to disable the execution on the leading edge, pass
              // `{leading: false}`. To disable execution on the trailing edge, ditto.
              _.throttle = function (func, wait, options) {
                var context, args, result;
                var timeout = null;
                var previous = 0;
                if (!options) options = {};
                var later = function later() {
                  previous = options.leading === false ? 0 : _.now();
                  timeout = null;
                  result = func.apply(context, args);
                  if (!timeout) context = args = null;
                };
                return function () {
                  var now = _.now();
                  if (!previous && options.leading === false) previous = now;
                  var remaining = wait - (now - previous);
                  context = this;
                  args = arguments;
                  if (remaining <= 0 || remaining > wait) {
                    if (timeout) {
                      clearTimeout(timeout);
                      timeout = null;
                    }
                    previous = now;
                    result = func.apply(context, args);
                    if (!timeout) context = args = null;
                  } else if (!timeout && options.trailing !== false) {
                    timeout = setTimeout(later, remaining);
                  }
                  return result;
                };
              };

              // Returns a function, that, as long as it continues to be invoked, will not
              // be triggered. The function will be called after it stops being called for
              // N milliseconds. If `immediate` is passed, trigger the function on the
              // leading edge, instead of the trailing.
              _.debounce = function (func, wait, immediate) {
                var timeout, args, context, timestamp, result;

                var later = function later() {
                  var last = _.now() - timestamp;

                  if (last < wait && last >= 0) {
                    timeout = setTimeout(later, wait - last);
                  } else {
                    timeout = null;
                    if (!immediate) {
                      result = func.apply(context, args);
                      if (!timeout) context = args = null;
                    }
                  }
                };

                return function () {
                  context = this;
                  args = arguments;
                  timestamp = _.now();
                  var callNow = immediate && !timeout;
                  if (!timeout) timeout = setTimeout(later, wait);
                  if (callNow) {
                    result = func.apply(context, args);
                    context = args = null;
                  }

                  return result;
                };
              };

              // Returns the first function passed as an argument to the second,
              // allowing you to adjust arguments, run code before and after, and
              // conditionally execute the original function.
              _.wrap = function (func, wrapper) {
                return _.partial(wrapper, func);
              };

              // Returns a negated version of the passed-in predicate.
              _.negate = function (predicate) {
                return function () {
                  return !predicate.apply(this, arguments);
                };
              };

              // Returns a function that is the composition of a list of functions, each
              // consuming the return value of the function that follows.
              _.compose = function () {
                var args = arguments;
                var start = args.length - 1;
                return function () {
                  var i = start;
                  var result = args[start].apply(this, arguments);
                  while (i--) {
                    result = args[i].call(this, result);
                  }return result;
                };
              };

              // Returns a function that will only be executed on and after the Nth call.
              _.after = function (times, func) {
                return function () {
                  if (--times < 1) {
                    return func.apply(this, arguments);
                  }
                };
              };

              // Returns a function that will only be executed up to (but not including) the Nth call.
              _.before = function (times, func) {
                var memo;
                return function () {
                  if (--times > 0) {
                    memo = func.apply(this, arguments);
                  }
                  if (times <= 1) func = null;
                  return memo;
                };
              };

              // Returns a function that will be executed at most one time, no matter how
              // often you call it. Useful for lazy initialization.
              _.once = _.partial(_.before, 2);

              // Object Functions
              // ----------------

              // Keys in IE < 9 that won't be iterated by `for key in ...` and thus missed.
              var hasEnumBug = !{ toString: null }.propertyIsEnumerable('toString');
              var nonEnumerableProps = ['valueOf', 'isPrototypeOf', 'toString', 'propertyIsEnumerable', 'hasOwnProperty', 'toLocaleString'];

              function collectNonEnumProps(obj, keys) {
                var nonEnumIdx = nonEnumerableProps.length;
                var constructor = obj.constructor;
                var proto = _.isFunction(constructor) && constructor.prototype || ObjProto;

                // Constructor is a special case.
                var prop = 'constructor';
                if (_.has(obj, prop) && !_.contains(keys, prop)) keys.push(prop);

                while (nonEnumIdx--) {
                  prop = nonEnumerableProps[nonEnumIdx];
                  if (prop in obj && obj[prop] !== proto[prop] && !_.contains(keys, prop)) {
                    keys.push(prop);
                  }
                }
              }

              // Retrieve the names of an object's own properties.
              // Delegates to **ECMAScript 5**'s native `Object.keys`
              _.keys = function (obj) {
                if (!_.isObject(obj)) return [];
                if (nativeKeys) return nativeKeys(obj);
                var keys = [];
                for (var key in obj) {
                  if (_.has(obj, key)) keys.push(key);
                } // Ahem, IE < 9.
                if (hasEnumBug) collectNonEnumProps(obj, keys);
                return keys;
              };

              // Retrieve all the property names of an object.
              _.allKeys = function (obj) {
                if (!_.isObject(obj)) return [];
                var keys = [];
                for (var key in obj) {
                  keys.push(key);
                } // Ahem, IE < 9.
                if (hasEnumBug) collectNonEnumProps(obj, keys);
                return keys;
              };

              // Retrieve the values of an object's properties.
              _.values = function (obj) {
                var keys = _.keys(obj);
                var length = keys.length;
                var values = Array(length);
                for (var i = 0; i < length; i++) {
                  values[i] = obj[keys[i]];
                }
                return values;
              };

              // Returns the results of applying the iteratee to each element of the object
              // In contrast to _.map it returns an object
              _.mapObject = function (obj, iteratee, context) {
                iteratee = cb(iteratee, context);
                var keys = _.keys(obj),
                    length = keys.length,
                    results = {},
                    currentKey;
                for (var index = 0; index < length; index++) {
                  currentKey = keys[index];
                  results[currentKey] = iteratee(obj[currentKey], currentKey, obj);
                }
                return results;
              };

              // Convert an object into a list of `[key, value]` pairs.
              _.pairs = function (obj) {
                var keys = _.keys(obj);
                var length = keys.length;
                var pairs = Array(length);
                for (var i = 0; i < length; i++) {
                  pairs[i] = [keys[i], obj[keys[i]]];
                }
                return pairs;
              };

              // Invert the keys and values of an object. The values must be serializable.
              _.invert = function (obj) {
                var result = {};
                var keys = _.keys(obj);
                for (var i = 0, length = keys.length; i < length; i++) {
                  result[obj[keys[i]]] = keys[i];
                }
                return result;
              };

              // Return a sorted list of the function names available on the object.
              // Aliased as `methods`
              _.functions = _.methods = function (obj) {
                var names = [];
                for (var key in obj) {
                  if (_.isFunction(obj[key])) names.push(key);
                }
                return names.sort();
              };

              // Extend a given object with all the properties in passed-in object(s).
              _.extend = createAssigner(_.allKeys);

              // Assigns a given object with all the own properties in the passed-in object(s)
              // (https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object/assign)
              _.extendOwn = _.assign = createAssigner(_.keys);

              // Returns the first key on an object that passes a predicate test
              _.findKey = function (obj, predicate, context) {
                predicate = cb(predicate, context);
                var keys = _.keys(obj),
                    key;
                for (var i = 0, length = keys.length; i < length; i++) {
                  key = keys[i];
                  if (predicate(obj[key], key, obj)) return key;
                }
              };

              // Return a copy of the object only containing the whitelisted properties.
              _.pick = function (object, oiteratee, context) {
                var result = {},
                    obj = object,
                    iteratee,
                    keys;
                if (obj == null) return result;
                if (_.isFunction(oiteratee)) {
                  keys = _.allKeys(obj);
                  iteratee = optimizeCb(oiteratee, context);
                } else {
                  keys = flatten(arguments, false, false, 1);
                  iteratee = function iteratee(value, key, obj) {
                    return key in obj;
                  };
                  obj = Object(obj);
                }
                for (var i = 0, length = keys.length; i < length; i++) {
                  var key = keys[i];
                  var value = obj[key];
                  if (iteratee(value, key, obj)) result[key] = value;
                }
                return result;
              };

              // Return a copy of the object without the blacklisted properties.
              _.omit = function (obj, iteratee, context) {
                if (_.isFunction(iteratee)) {
                  iteratee = _.negate(iteratee);
                } else {
                  var keys = _.map(flatten(arguments, false, false, 1), String);
                  iteratee = function iteratee(value, key) {
                    return !_.contains(keys, key);
                  };
                }
                return _.pick(obj, iteratee, context);
              };

              // Fill in a given object with default properties.
              _.defaults = createAssigner(_.allKeys, true);

              // Creates an object that inherits from the given prototype object.
              // If additional properties are provided then they will be added to the
              // created object.
              _.create = function (prototype, props) {
                var result = baseCreate(prototype);
                if (props) _.extendOwn(result, props);
                return result;
              };

              // Create a (shallow-cloned) duplicate of an object.
              _.clone = function (obj) {
                if (!_.isObject(obj)) return obj;
                return _.isArray(obj) ? obj.slice() : _.extend({}, obj);
              };

              // Invokes interceptor with the obj, and then returns obj.
              // The primary purpose of this method is to "tap into" a method chain, in
              // order to perform operations on intermediate results within the chain.
              _.tap = function (obj, interceptor) {
                interceptor(obj);
                return obj;
              };

              // Returns whether an object has a given set of `key:value` pairs.
              _.isMatch = function (object, attrs) {
                var keys = _.keys(attrs),
                    length = keys.length;
                if (object == null) return !length;
                var obj = Object(object);
                for (var i = 0; i < length; i++) {
                  var key = keys[i];
                  if (attrs[key] !== obj[key] || !(key in obj)) return false;
                }
                return true;
              };

              // Internal recursive comparison function for `isEqual`.
              var eq = function eq(a, b, aStack, bStack) {
                // Identical objects are equal. `0 === -0`, but they aren't identical.
                // See the [Harmony `egal` proposal](http://wiki.ecmascript.org/doku.php?id=harmony:egal).
                if (a === b) return a !== 0 || 1 / a === 1 / b;
                // A strict comparison is necessary because `null == undefined`.
                if (a == null || b == null) return a === b;
                // Unwrap any wrapped objects.
                if (a instanceof _) a = a._wrapped;
                if (b instanceof _) b = b._wrapped;
                // Compare `[[Class]]` names.
                var className = toString.call(a);
                if (className !== toString.call(b)) return false;
                switch (className) {
                  // Strings, numbers, regular expressions, dates, and booleans are compared by value.
                  case '[object RegExp]':
                  // RegExps are coerced to strings for comparison (Note: '' + /a/i === '/a/i')
                  case '[object String]':
                    // Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
                    // equivalent to `new String("5")`.
                    return '' + a === '' + b;
                  case '[object Number]':
                    // `NaN`s are equivalent, but non-reflexive.
                    // Object(NaN) is equivalent to NaN
                    if (+a !== +a) return +b !== +b;
                    // An `egal` comparison is performed for other numeric values.
                    return +a === 0 ? 1 / +a === 1 / b : +a === +b;
                  case '[object Date]':
                  case '[object Boolean]':
                    // Coerce dates and booleans to numeric primitive values. Dates are compared by their
                    // millisecond representations. Note that invalid dates with millisecond representations
                    // of `NaN` are not equivalent.
                    return +a === +b;
                }

                var areArrays = className === '[object Array]';
                if (!areArrays) {
                  if ((typeof a === 'undefined' ? 'undefined' : _typeof2(a)) != 'object' || (typeof b === 'undefined' ? 'undefined' : _typeof2(b)) != 'object') return false;

                  // Objects with different constructors are not equivalent, but `Object`s or `Array`s
                  // from different frames are.
                  var aCtor = a.constructor,
                      bCtor = b.constructor;
                  if (aCtor !== bCtor && !(_.isFunction(aCtor) && aCtor instanceof aCtor && _.isFunction(bCtor) && bCtor instanceof bCtor) && 'constructor' in a && 'constructor' in b) {
                    return false;
                  }
                }
                // Assume equality for cyclic structures. The algorithm for detecting cyclic
                // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.

                // Initializing stack of traversed objects.
                // It's done here since we only need them for objects and arrays comparison.
                aStack = aStack || [];
                bStack = bStack || [];
                var length = aStack.length;
                while (length--) {
                  // Linear search. Performance is inversely proportional to the number of
                  // unique nested structures.
                  if (aStack[length] === a) return bStack[length] === b;
                }

                // Add the first object to the stack of traversed objects.
                aStack.push(a);
                bStack.push(b);

                // Recursively compare objects and arrays.
                if (areArrays) {
                  // Compare array lengths to determine if a deep comparison is necessary.
                  length = a.length;
                  if (length !== b.length) return false;
                  // Deep compare the contents, ignoring non-numeric properties.
                  while (length--) {
                    if (!eq(a[length], b[length], aStack, bStack)) return false;
                  }
                } else {
                  // Deep compare objects.
                  var keys = _.keys(a),
                      key;
                  length = keys.length;
                  // Ensure that both objects contain the same number of properties before comparing deep equality.
                  if (_.keys(b).length !== length) return false;
                  while (length--) {
                    // Deep compare each member
                    key = keys[length];
                    if (!(_.has(b, key) && eq(a[key], b[key], aStack, bStack))) return false;
                  }
                }
                // Remove the first object from the stack of traversed objects.
                aStack.pop();
                bStack.pop();
                return true;
              };

              // Perform a deep comparison to check if two objects are equal.
              _.isEqual = function (a, b) {
                return eq(a, b);
              };

              // Is a given array, string, or object empty?
              // An "empty" object has no enumerable own-properties.
              _.isEmpty = function (obj) {
                if (obj == null) return true;
                if (isArrayLike(obj) && (_.isArray(obj) || _.isString(obj) || _.isArguments(obj))) return obj.length === 0;
                return _.keys(obj).length === 0;
              };

              // Is a given value a DOM element?
              _.isElement = function (obj) {
                return !!(obj && obj.nodeType === 1);
              };

              // Is a given value an array?
              // Delegates to ECMA5's native Array.isArray
              _.isArray = nativeIsArray || function (obj) {
                return toString.call(obj) === '[object Array]';
              };

              // Is a given variable an object?
              _.isObject = function (obj) {
                var type = typeof obj === 'undefined' ? 'undefined' : _typeof2(obj);
                return type === 'function' || type === 'object' && !!obj;
              };

              // Add some isType methods: isArguments, isFunction, isString, isNumber, isDate, isRegExp, isError.
              _.each(['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp', 'Error'], function (name) {
                _['is' + name] = function (obj) {
                  return toString.call(obj) === '[object ' + name + ']';
                };
              });

              // Define a fallback version of the method in browsers (ahem, IE < 9), where
              // there isn't any inspectable "Arguments" type.
              if (!_.isArguments(arguments)) {
                _.isArguments = function (obj) {
                  return _.has(obj, 'callee');
                };
              }

              // Optimize `isFunction` if appropriate. Work around some typeof bugs in old v8,
              // IE 11 (#1621), and in Safari 8 (#1929).
              if (typeof /./ != 'function' && (typeof Int8Array === 'undefined' ? 'undefined' : _typeof2(Int8Array)) != 'object') {
                _.isFunction = function (obj) {
                  return typeof obj == 'function' || false;
                };
              }

              // Is a given object a finite number?
              _.isFinite = function (obj) {
                return isFinite(obj) && !isNaN(parseFloat(obj));
              };

              // Is the given value `NaN`? (NaN is the only number which does not equal itself).
              _.isNaN = function (obj) {
                return _.isNumber(obj) && obj !== +obj;
              };

              // Is a given value a boolean?
              _.isBoolean = function (obj) {
                return obj === true || obj === false || toString.call(obj) === '[object Boolean]';
              };

              // Is a given value equal to null?
              _.isNull = function (obj) {
                return obj === null;
              };

              // Is a given variable undefined?
              _.isUndefined = function (obj) {
                return obj === void 0;
              };

              // Shortcut function for checking if an object has a given property directly
              // on itself (in other words, not on a prototype).
              _.has = function (obj, key) {
                return obj != null && hasOwnProperty.call(obj, key);
              };

              // Utility Functions
              // -----------------

              // Run Underscore.js in *noConflict* mode, returning the `_` variable to its
              // previous owner. Returns a reference to the Underscore object.
              _.noConflict = function () {
                root._ = previousUnderscore;
                return this;
              };

              // Keep the identity function around for default iteratees.
              _.identity = function (value) {
                return value;
              };

              // Predicate-generating functions. Often useful outside of Underscore.
              _.constant = function (value) {
                return function () {
                  return value;
                };
              };

              _.noop = function () {};

              _.property = property;

              // Generates a function for a given object that returns a given property.
              _.propertyOf = function (obj) {
                return obj == null ? function () {} : function (key) {
                  return obj[key];
                };
              };

              // Returns a predicate for checking whether an object has a given set of
              // `key:value` pairs.
              _.matcher = _.matches = function (attrs) {
                attrs = _.extendOwn({}, attrs);
                return function (obj) {
                  return _.isMatch(obj, attrs);
                };
              };

              // Run a function **n** times.
              _.times = function (n, iteratee, context) {
                var accum = Array(Math.max(0, n));
                iteratee = optimizeCb(iteratee, context, 1);
                for (var i = 0; i < n; i++) {
                  accum[i] = iteratee(i);
                }return accum;
              };

              // Return a random integer between min and max (inclusive).
              _.random = function (min, max) {
                if (max == null) {
                  max = min;
                  min = 0;
                }
                return min + Math.floor(Math.random() * (max - min + 1));
              };

              // A (possibly faster) way to get the current timestamp as an integer.
              _.now = Date.now || function () {
                return new Date().getTime();
              };

              // List of HTML entities for escaping.
              var escapeMap = {
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                "'": '&#x27;',
                '`': '&#x60;'
              };
              var unescapeMap = _.invert(escapeMap);

              // Functions for escaping and unescaping strings to/from HTML interpolation.
              var createEscaper = function createEscaper(map) {
                var escaper = function escaper(match) {
                  return map[match];
                };
                // Regexes for identifying a key that needs to be escaped
                var source = '(?:' + _.keys(map).join('|') + ')';
                var testRegexp = RegExp(source);
                var replaceRegexp = RegExp(source, 'g');
                return function (string) {
                  string = string == null ? '' : '' + string;
                  return testRegexp.test(string) ? string.replace(replaceRegexp, escaper) : string;
                };
              };
              _.escape = createEscaper(escapeMap);
              _.unescape = createEscaper(unescapeMap);

              // If the value of the named `property` is a function then invoke it with the
              // `object` as context; otherwise, return it.
              _.result = function (object, property, fallback) {
                var value = object == null ? void 0 : object[property];
                if (value === void 0) {
                  value = fallback;
                }
                return _.isFunction(value) ? value.call(object) : value;
              };

              // Generate a unique integer id (unique within the entire client session).
              // Useful for temporary DOM ids.
              var idCounter = 0;
              _.uniqueId = function (prefix) {
                var id = ++idCounter + '';
                return prefix ? prefix + id : id;
              };

              // By default, Underscore uses ERB-style template delimiters, change the
              // following template settings to use alternative delimiters.
              _.templateSettings = {
                evaluate: /<%([\s\S]+?)%>/g,
                interpolate: /<%=([\s\S]+?)%>/g,
                escape: /<%-([\s\S]+?)%>/g
              };

              // When customizing `templateSettings`, if you don't want to define an
              // interpolation, evaluation or escaping regex, we need one that is
              // guaranteed not to match.
              var noMatch = /(.)^/;

              // Certain characters need to be escaped so that they can be put into a
              // string literal.
              var escapes = {
                "'": "'",
                '\\': '\\',
                '\r': 'r',
                '\n': 'n',
                '\u2028': 'u2028',
                '\u2029': 'u2029'
              };

              var escaper = /\\|'|\r|\n|\u2028|\u2029/g;

              var escapeChar = function escapeChar(match) {
                return '\\' + escapes[match];
              };

              // JavaScript micro-templating, similar to John Resig's implementation.
              // Underscore templating handles arbitrary delimiters, preserves whitespace,
              // and correctly escapes quotes within interpolated code.
              // NB: `oldSettings` only exists for backwards compatibility.
              _.template = function (text, settings, oldSettings) {
                if (!settings && oldSettings) settings = oldSettings;
                settings = _.defaults({}, settings, _.templateSettings);

                // Combine delimiters into one regular expression via alternation.
                var matcher = RegExp([(settings.escape || noMatch).source, (settings.interpolate || noMatch).source, (settings.evaluate || noMatch).source].join('|') + '|$', 'g');

                // Compile the template source, escaping string literals appropriately.
                var index = 0;
                var source = "__p+='";
                text.replace(matcher, function (match, escape, interpolate, evaluate, offset) {
                  source += text.slice(index, offset).replace(escaper, escapeChar);
                  index = offset + match.length;

                  if (escape) {
                    source += "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'";
                  } else if (interpolate) {
                    source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
                  } else if (evaluate) {
                    source += "';\n" + evaluate + "\n__p+='";
                  }

                  // Adobe VMs need the match returned to produce the correct offest.
                  return match;
                });
                source += "';\n";

                // If a variable is not specified, place data values in local scope.
                if (!settings.variable) source = 'with(obj||{}){\n' + source + '}\n';

                source = "var __t,__p='',__j=Array.prototype.join," + "print=function(){__p+=__j.call(arguments,'');};\n" + source + 'return __p;\n';

                try {
                  var render = new Function(settings.variable || 'obj', '_', source);
                } catch (e) {
                  e.source = source;
                  throw e;
                }

                var template = function template(data) {
                  return render.call(this, data, _);
                };

                // Provide the compiled source as a convenience for precompilation.
                var argument = settings.variable || 'obj';
                template.source = 'function(' + argument + '){\n' + source + '}';

                return template;
              };

              // Add a "chain" function. Start chaining a wrapped Underscore object.
              _.chain = function (obj) {
                var instance = _(obj);
                instance._chain = true;
                return instance;
              };

              // OOP
              // ---------------
              // If Underscore is called as a function, it returns a wrapped object that
              // can be used OO-style. This wrapper holds altered versions of all the
              // underscore functions. Wrapped objects may be chained.

              // Helper function to continue chaining intermediate results.
              var result = function result(instance, obj) {
                return instance._chain ? _(obj).chain() : obj;
              };

              // Add your own custom functions to the Underscore object.
              _.mixin = function (obj) {
                _.each(_.functions(obj), function (name) {
                  var func = _[name] = obj[name];
                  _.prototype[name] = function () {
                    var args = [this._wrapped];
                    push.apply(args, arguments);
                    return result(this, func.apply(_, args));
                  };
                });
              };

              // Add all of the Underscore functions to the wrapper object.
              _.mixin(_);

              // Add all mutator Array functions to the wrapper.
              _.each(['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'], function (name) {
                var method = ArrayProto[name];
                _.prototype[name] = function () {
                  var obj = this._wrapped;
                  method.apply(obj, arguments);
                  if ((name === 'shift' || name === 'splice') && obj.length === 0) delete obj[0];
                  return result(this, obj);
                };
              });

              // Add all accessor Array functions to the wrapper.
              _.each(['concat', 'join', 'slice'], function (name) {
                var method = ArrayProto[name];
                _.prototype[name] = function () {
                  return result(this, method.apply(this._wrapped, arguments));
                };
              });

              // Extracts the result from a wrapped and chained object.
              _.prototype.value = function () {
                return this._wrapped;
              };

              // Provide unwrapping proxy for some methods used in engine operations
              // such as arithmetic and JSON stringification.
              _.prototype.valueOf = _.prototype.toJSON = _.prototype.value;

              _.prototype.toString = function () {
                return '' + this._wrapped;
              };

              // AMD registration happens at the end for compatibility with AMD loaders
              // that may not enforce next-turn semantics on modules. Even though general
              // practice for AMD registration is to be anonymous, underscore registers
              // as a named module because, like jQuery, it is a base library that is
              // popular enough to be bundled in a third party lib, but not be part of
              // an AMD load request. Those cases could generate an error when an
              // anonymous define() is called outside of a loader request.
              if (true) {
                !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = function () {
                  return _;
                }.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
              }
            }).call(this);

            /***/
          }]
          /******/)
        );
      });
      //# sourceMappingURL=hierarchy.js.map

      /***/
    },
    /* 3 */
    /***/function (module, exports, __webpack_require__) {

      var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__; //     Underscore.js 1.8.3
      //     http://underscorejs.org
      //     (c) 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
      //     Underscore may be freely distributed under the MIT license.

      (function () {

        // Baseline setup
        // --------------

        // Establish the root object, `window` in the browser, or `exports` on the server.
        var root = this;

        // Save the previous value of the `_` variable.
        var previousUnderscore = root._;

        // Save bytes in the minified (but not gzipped) version:
        var ArrayProto = Array.prototype,
            ObjProto = Object.prototype,
            FuncProto = Function.prototype;

        // Create quick reference variables for speed access to core prototypes.
        var push = ArrayProto.push,
            slice = ArrayProto.slice,
            toString = ObjProto.toString,
            hasOwnProperty = ObjProto.hasOwnProperty;

        // All **ECMAScript 5** native function implementations that we hope to use
        // are declared here.
        var nativeIsArray = Array.isArray,
            nativeKeys = Object.keys,
            nativeBind = FuncProto.bind,
            nativeCreate = Object.create;

        // Naked function reference for surrogate-prototype-swapping.
        var Ctor = function Ctor() {};

        // Create a safe reference to the Underscore object for use below.
        var _ = function _(obj) {
          if (obj instanceof _) return obj;
          if (!(this instanceof _)) return new _(obj);
          this._wrapped = obj;
        };

        // Export the Underscore object for **Node.js**, with
        // backwards-compatibility for the old `require()` API. If we're in
        // the browser, add `_` as a global object.
        if (true) {
          if (typeof module !== 'undefined' && module.exports) {
            exports = module.exports = _;
          }
          exports._ = _;
        } else {
          root._ = _;
        }

        // Current version.
        _.VERSION = '1.8.3';

        // Internal function that returns an efficient (for current engines) version
        // of the passed-in callback, to be repeatedly applied in other Underscore
        // functions.
        var optimizeCb = function optimizeCb(func, context, argCount) {
          if (context === void 0) return func;
          switch (argCount == null ? 3 : argCount) {
            case 1:
              return function (value) {
                return func.call(context, value);
              };
            case 2:
              return function (value, other) {
                return func.call(context, value, other);
              };
            case 3:
              return function (value, index, collection) {
                return func.call(context, value, index, collection);
              };
            case 4:
              return function (accumulator, value, index, collection) {
                return func.call(context, accumulator, value, index, collection);
              };
          }
          return function () {
            return func.apply(context, arguments);
          };
        };

        // A mostly-internal function to generate callbacks that can be applied
        // to each element in a collection, returning the desired result — either
        // identity, an arbitrary callback, a property matcher, or a property accessor.
        var cb = function cb(value, context, argCount) {
          if (value == null) return _.identity;
          if (_.isFunction(value)) return optimizeCb(value, context, argCount);
          if (_.isObject(value)) return _.matcher(value);
          return _.property(value);
        };
        _.iteratee = function (value, context) {
          return cb(value, context, Infinity);
        };

        // An internal function for creating assigner functions.
        var createAssigner = function createAssigner(keysFunc, undefinedOnly) {
          return function (obj) {
            var length = arguments.length;
            if (length < 2 || obj == null) return obj;
            for (var index = 1; index < length; index++) {
              var source = arguments[index],
                  keys = keysFunc(source),
                  l = keys.length;
              for (var i = 0; i < l; i++) {
                var key = keys[i];
                if (!undefinedOnly || obj[key] === void 0) obj[key] = source[key];
              }
            }
            return obj;
          };
        };

        // An internal function for creating a new object that inherits from another.
        var baseCreate = function baseCreate(prototype) {
          if (!_.isObject(prototype)) return {};
          if (nativeCreate) return nativeCreate(prototype);
          Ctor.prototype = prototype;
          var result = new Ctor();
          Ctor.prototype = null;
          return result;
        };

        var property = function property(key) {
          return function (obj) {
            return obj == null ? void 0 : obj[key];
          };
        };

        // Helper for collection methods to determine whether a collection
        // should be iterated as an array or as an object
        // Related: http://people.mozilla.org/~jorendorff/es6-draft.html#sec-tolength
        // Avoids a very nasty iOS 8 JIT bug on ARM-64. #2094
        var MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;
        var getLength = property('length');
        var isArrayLike = function isArrayLike(collection) {
          var length = getLength(collection);
          return typeof length == 'number' && length >= 0 && length <= MAX_ARRAY_INDEX;
        };

        // Collection Functions
        // --------------------

        // The cornerstone, an `each` implementation, aka `forEach`.
        // Handles raw objects in addition to array-likes. Treats all
        // sparse array-likes as if they were dense.
        _.each = _.forEach = function (obj, iteratee, context) {
          iteratee = optimizeCb(iteratee, context);
          var i, length;
          if (isArrayLike(obj)) {
            for (i = 0, length = obj.length; i < length; i++) {
              iteratee(obj[i], i, obj);
            }
          } else {
            var keys = _.keys(obj);
            for (i = 0, length = keys.length; i < length; i++) {
              iteratee(obj[keys[i]], keys[i], obj);
            }
          }
          return obj;
        };

        // Return the results of applying the iteratee to each element.
        _.map = _.collect = function (obj, iteratee, context) {
          iteratee = cb(iteratee, context);
          var keys = !isArrayLike(obj) && _.keys(obj),
              length = (keys || obj).length,
              results = Array(length);
          for (var index = 0; index < length; index++) {
            var currentKey = keys ? keys[index] : index;
            results[index] = iteratee(obj[currentKey], currentKey, obj);
          }
          return results;
        };

        // Create a reducing function iterating left or right.
        function createReduce(dir) {
          // Optimized iterator function as using arguments.length
          // in the main function will deoptimize the, see #1991.
          function iterator(obj, iteratee, memo, keys, index, length) {
            for (; index >= 0 && index < length; index += dir) {
              var currentKey = keys ? keys[index] : index;
              memo = iteratee(memo, obj[currentKey], currentKey, obj);
            }
            return memo;
          }

          return function (obj, iteratee, memo, context) {
            iteratee = optimizeCb(iteratee, context, 4);
            var keys = !isArrayLike(obj) && _.keys(obj),
                length = (keys || obj).length,
                index = dir > 0 ? 0 : length - 1;
            // Determine the initial value if none is provided.
            if (arguments.length < 3) {
              memo = obj[keys ? keys[index] : index];
              index += dir;
            }
            return iterator(obj, iteratee, memo, keys, index, length);
          };
        }

        // **Reduce** builds up a single result from a list of values, aka `inject`,
        // or `foldl`.
        _.reduce = _.foldl = _.inject = createReduce(1);

        // The right-associative version of reduce, also known as `foldr`.
        _.reduceRight = _.foldr = createReduce(-1);

        // Return the first value which passes a truth test. Aliased as `detect`.
        _.find = _.detect = function (obj, predicate, context) {
          var key;
          if (isArrayLike(obj)) {
            key = _.findIndex(obj, predicate, context);
          } else {
            key = _.findKey(obj, predicate, context);
          }
          if (key !== void 0 && key !== -1) return obj[key];
        };

        // Return all the elements that pass a truth test.
        // Aliased as `select`.
        _.filter = _.select = function (obj, predicate, context) {
          var results = [];
          predicate = cb(predicate, context);
          _.each(obj, function (value, index, list) {
            if (predicate(value, index, list)) results.push(value);
          });
          return results;
        };

        // Return all the elements for which a truth test fails.
        _.reject = function (obj, predicate, context) {
          return _.filter(obj, _.negate(cb(predicate)), context);
        };

        // Determine whether all of the elements match a truth test.
        // Aliased as `all`.
        _.every = _.all = function (obj, predicate, context) {
          predicate = cb(predicate, context);
          var keys = !isArrayLike(obj) && _.keys(obj),
              length = (keys || obj).length;
          for (var index = 0; index < length; index++) {
            var currentKey = keys ? keys[index] : index;
            if (!predicate(obj[currentKey], currentKey, obj)) return false;
          }
          return true;
        };

        // Determine if at least one element in the object matches a truth test.
        // Aliased as `any`.
        _.some = _.any = function (obj, predicate, context) {
          predicate = cb(predicate, context);
          var keys = !isArrayLike(obj) && _.keys(obj),
              length = (keys || obj).length;
          for (var index = 0; index < length; index++) {
            var currentKey = keys ? keys[index] : index;
            if (predicate(obj[currentKey], currentKey, obj)) return true;
          }
          return false;
        };

        // Determine if the array or object contains a given item (using `===`).
        // Aliased as `includes` and `include`.
        _.contains = _.includes = _.include = function (obj, item, fromIndex, guard) {
          if (!isArrayLike(obj)) obj = _.values(obj);
          if (typeof fromIndex != 'number' || guard) fromIndex = 0;
          return _.indexOf(obj, item, fromIndex) >= 0;
        };

        // Invoke a method (with arguments) on every item in a collection.
        _.invoke = function (obj, method) {
          var args = slice.call(arguments, 2);
          var isFunc = _.isFunction(method);
          return _.map(obj, function (value) {
            var func = isFunc ? method : value[method];
            return func == null ? func : func.apply(value, args);
          });
        };

        // Convenience version of a common use case of `map`: fetching a property.
        _.pluck = function (obj, key) {
          return _.map(obj, _.property(key));
        };

        // Convenience version of a common use case of `filter`: selecting only objects
        // containing specific `key:value` pairs.
        _.where = function (obj, attrs) {
          return _.filter(obj, _.matcher(attrs));
        };

        // Convenience version of a common use case of `find`: getting the first object
        // containing specific `key:value` pairs.
        _.findWhere = function (obj, attrs) {
          return _.find(obj, _.matcher(attrs));
        };

        // Return the maximum element (or element-based computation).
        _.max = function (obj, iteratee, context) {
          var result = -Infinity,
              lastComputed = -Infinity,
              value,
              computed;
          if (iteratee == null && obj != null) {
            obj = isArrayLike(obj) ? obj : _.values(obj);
            for (var i = 0, length = obj.length; i < length; i++) {
              value = obj[i];
              if (value > result) {
                result = value;
              }
            }
          } else {
            iteratee = cb(iteratee, context);
            _.each(obj, function (value, index, list) {
              computed = iteratee(value, index, list);
              if (computed > lastComputed || computed === -Infinity && result === -Infinity) {
                result = value;
                lastComputed = computed;
              }
            });
          }
          return result;
        };

        // Return the minimum element (or element-based computation).
        _.min = function (obj, iteratee, context) {
          var result = Infinity,
              lastComputed = Infinity,
              value,
              computed;
          if (iteratee == null && obj != null) {
            obj = isArrayLike(obj) ? obj : _.values(obj);
            for (var i = 0, length = obj.length; i < length; i++) {
              value = obj[i];
              if (value < result) {
                result = value;
              }
            }
          } else {
            iteratee = cb(iteratee, context);
            _.each(obj, function (value, index, list) {
              computed = iteratee(value, index, list);
              if (computed < lastComputed || computed === Infinity && result === Infinity) {
                result = value;
                lastComputed = computed;
              }
            });
          }
          return result;
        };

        // Shuffle a collection, using the modern version of the
        // [Fisher-Yates shuffle](http://en.wikipedia.org/wiki/Fisher–Yates_shuffle).
        _.shuffle = function (obj) {
          var set = isArrayLike(obj) ? obj : _.values(obj);
          var length = set.length;
          var shuffled = Array(length);
          for (var index = 0, rand; index < length; index++) {
            rand = _.random(0, index);
            if (rand !== index) shuffled[index] = shuffled[rand];
            shuffled[rand] = set[index];
          }
          return shuffled;
        };

        // Sample **n** random values from a collection.
        // If **n** is not specified, returns a single random element.
        // The internal `guard` argument allows it to work with `map`.
        _.sample = function (obj, n, guard) {
          if (n == null || guard) {
            if (!isArrayLike(obj)) obj = _.values(obj);
            return obj[_.random(obj.length - 1)];
          }
          return _.shuffle(obj).slice(0, Math.max(0, n));
        };

        // Sort the object's values by a criterion produced by an iteratee.
        _.sortBy = function (obj, iteratee, context) {
          iteratee = cb(iteratee, context);
          return _.pluck(_.map(obj, function (value, index, list) {
            return {
              value: value,
              index: index,
              criteria: iteratee(value, index, list)
            };
          }).sort(function (left, right) {
            var a = left.criteria;
            var b = right.criteria;
            if (a !== b) {
              if (a > b || a === void 0) return 1;
              if (a < b || b === void 0) return -1;
            }
            return left.index - right.index;
          }), 'value');
        };

        // An internal function used for aggregate "group by" operations.
        var group = function group(behavior) {
          return function (obj, iteratee, context) {
            var result = {};
            iteratee = cb(iteratee, context);
            _.each(obj, function (value, index) {
              var key = iteratee(value, index, obj);
              behavior(result, value, key);
            });
            return result;
          };
        };

        // Groups the object's values by a criterion. Pass either a string attribute
        // to group by, or a function that returns the criterion.
        _.groupBy = group(function (result, value, key) {
          if (_.has(result, key)) result[key].push(value);else result[key] = [value];
        });

        // Indexes the object's values by a criterion, similar to `groupBy`, but for
        // when you know that your index values will be unique.
        _.indexBy = group(function (result, value, key) {
          result[key] = value;
        });

        // Counts instances of an object that group by a certain criterion. Pass
        // either a string attribute to count by, or a function that returns the
        // criterion.
        _.countBy = group(function (result, value, key) {
          if (_.has(result, key)) result[key]++;else result[key] = 1;
        });

        // Safely create a real, live array from anything iterable.
        _.toArray = function (obj) {
          if (!obj) return [];
          if (_.isArray(obj)) return slice.call(obj);
          if (isArrayLike(obj)) return _.map(obj, _.identity);
          return _.values(obj);
        };

        // Return the number of elements in an object.
        _.size = function (obj) {
          if (obj == null) return 0;
          return isArrayLike(obj) ? obj.length : _.keys(obj).length;
        };

        // Split a collection into two arrays: one whose elements all satisfy the given
        // predicate, and one whose elements all do not satisfy the predicate.
        _.partition = function (obj, predicate, context) {
          predicate = cb(predicate, context);
          var pass = [],
              fail = [];
          _.each(obj, function (value, key, obj) {
            (predicate(value, key, obj) ? pass : fail).push(value);
          });
          return [pass, fail];
        };

        // Array Functions
        // ---------------

        // Get the first element of an array. Passing **n** will return the first N
        // values in the array. Aliased as `head` and `take`. The **guard** check
        // allows it to work with `_.map`.
        _.first = _.head = _.take = function (array, n, guard) {
          if (array == null) return void 0;
          if (n == null || guard) return array[0];
          return _.initial(array, array.length - n);
        };

        // Returns everything but the last entry of the array. Especially useful on
        // the arguments object. Passing **n** will return all the values in
        // the array, excluding the last N.
        _.initial = function (array, n, guard) {
          return slice.call(array, 0, Math.max(0, array.length - (n == null || guard ? 1 : n)));
        };

        // Get the last element of an array. Passing **n** will return the last N
        // values in the array.
        _.last = function (array, n, guard) {
          if (array == null) return void 0;
          if (n == null || guard) return array[array.length - 1];
          return _.rest(array, Math.max(0, array.length - n));
        };

        // Returns everything but the first entry of the array. Aliased as `tail` and `drop`.
        // Especially useful on the arguments object. Passing an **n** will return
        // the rest N values in the array.
        _.rest = _.tail = _.drop = function (array, n, guard) {
          return slice.call(array, n == null || guard ? 1 : n);
        };

        // Trim out all falsy values from an array.
        _.compact = function (array) {
          return _.filter(array, _.identity);
        };

        // Internal implementation of a recursive `flatten` function.
        var flatten = function flatten(input, shallow, strict, startIndex) {
          var output = [],
              idx = 0;
          for (var i = startIndex || 0, length = getLength(input); i < length; i++) {
            var value = input[i];
            if (isArrayLike(value) && (_.isArray(value) || _.isArguments(value))) {
              //flatten current level of array or arguments object
              if (!shallow) value = flatten(value, shallow, strict);
              var j = 0,
                  len = value.length;
              output.length += len;
              while (j < len) {
                output[idx++] = value[j++];
              }
            } else if (!strict) {
              output[idx++] = value;
            }
          }
          return output;
        };

        // Flatten out an array, either recursively (by default), or just one level.
        _.flatten = function (array, shallow) {
          return flatten(array, shallow, false);
        };

        // Return a version of the array that does not contain the specified value(s).
        _.without = function (array) {
          return _.difference(array, slice.call(arguments, 1));
        };

        // Produce a duplicate-free version of the array. If the array has already
        // been sorted, you have the option of using a faster algorithm.
        // Aliased as `unique`.
        _.uniq = _.unique = function (array, isSorted, iteratee, context) {
          if (!_.isBoolean(isSorted)) {
            context = iteratee;
            iteratee = isSorted;
            isSorted = false;
          }
          if (iteratee != null) iteratee = cb(iteratee, context);
          var result = [];
          var seen = [];
          for (var i = 0, length = getLength(array); i < length; i++) {
            var value = array[i],
                computed = iteratee ? iteratee(value, i, array) : value;
            if (isSorted) {
              if (!i || seen !== computed) result.push(value);
              seen = computed;
            } else if (iteratee) {
              if (!_.contains(seen, computed)) {
                seen.push(computed);
                result.push(value);
              }
            } else if (!_.contains(result, value)) {
              result.push(value);
            }
          }
          return result;
        };

        // Produce an array that contains the union: each distinct element from all of
        // the passed-in arrays.
        _.union = function () {
          return _.uniq(flatten(arguments, true, true));
        };

        // Produce an array that contains every item shared between all the
        // passed-in arrays.
        _.intersection = function (array) {
          var result = [];
          var argsLength = arguments.length;
          for (var i = 0, length = getLength(array); i < length; i++) {
            var item = array[i];
            if (_.contains(result, item)) continue;
            for (var j = 1; j < argsLength; j++) {
              if (!_.contains(arguments[j], item)) break;
            }
            if (j === argsLength) result.push(item);
          }
          return result;
        };

        // Take the difference between one array and a number of other arrays.
        // Only the elements present in just the first array will remain.
        _.difference = function (array) {
          var rest = flatten(arguments, true, true, 1);
          return _.filter(array, function (value) {
            return !_.contains(rest, value);
          });
        };

        // Zip together multiple lists into a single array -- elements that share
        // an index go together.
        _.zip = function () {
          return _.unzip(arguments);
        };

        // Complement of _.zip. Unzip accepts an array of arrays and groups
        // each array's elements on shared indices
        _.unzip = function (array) {
          var length = array && _.max(array, getLength).length || 0;
          var result = Array(length);

          for (var index = 0; index < length; index++) {
            result[index] = _.pluck(array, index);
          }
          return result;
        };

        // Converts lists into objects. Pass either a single array of `[key, value]`
        // pairs, or two parallel arrays of the same length -- one of keys, and one of
        // the corresponding values.
        _.object = function (list, values) {
          var result = {};
          for (var i = 0, length = getLength(list); i < length; i++) {
            if (values) {
              result[list[i]] = values[i];
            } else {
              result[list[i][0]] = list[i][1];
            }
          }
          return result;
        };

        // Generator function to create the findIndex and findLastIndex functions
        function createPredicateIndexFinder(dir) {
          return function (array, predicate, context) {
            predicate = cb(predicate, context);
            var length = getLength(array);
            var index = dir > 0 ? 0 : length - 1;
            for (; index >= 0 && index < length; index += dir) {
              if (predicate(array[index], index, array)) return index;
            }
            return -1;
          };
        }

        // Returns the first index on an array-like that passes a predicate test
        _.findIndex = createPredicateIndexFinder(1);
        _.findLastIndex = createPredicateIndexFinder(-1);

        // Use a comparator function to figure out the smallest index at which
        // an object should be inserted so as to maintain order. Uses binary search.
        _.sortedIndex = function (array, obj, iteratee, context) {
          iteratee = cb(iteratee, context, 1);
          var value = iteratee(obj);
          var low = 0,
              high = getLength(array);
          while (low < high) {
            var mid = Math.floor((low + high) / 2);
            if (iteratee(array[mid]) < value) low = mid + 1;else high = mid;
          }
          return low;
        };

        // Generator function to create the indexOf and lastIndexOf functions
        function createIndexFinder(dir, predicateFind, sortedIndex) {
          return function (array, item, idx) {
            var i = 0,
                length = getLength(array);
            if (typeof idx == 'number') {
              if (dir > 0) {
                i = idx >= 0 ? idx : Math.max(idx + length, i);
              } else {
                length = idx >= 0 ? Math.min(idx + 1, length) : idx + length + 1;
              }
            } else if (sortedIndex && idx && length) {
              idx = sortedIndex(array, item);
              return array[idx] === item ? idx : -1;
            }
            if (item !== item) {
              idx = predicateFind(slice.call(array, i, length), _.isNaN);
              return idx >= 0 ? idx + i : -1;
            }
            for (idx = dir > 0 ? i : length - 1; idx >= 0 && idx < length; idx += dir) {
              if (array[idx] === item) return idx;
            }
            return -1;
          };
        }

        // Return the position of the first occurrence of an item in an array,
        // or -1 if the item is not included in the array.
        // If the array is large and already in sort order, pass `true`
        // for **isSorted** to use binary search.
        _.indexOf = createIndexFinder(1, _.findIndex, _.sortedIndex);
        _.lastIndexOf = createIndexFinder(-1, _.findLastIndex);

        // Generate an integer Array containing an arithmetic progression. A port of
        // the native Python `range()` function. See
        // [the Python documentation](http://docs.python.org/library/functions.html#range).
        _.range = function (start, stop, step) {
          if (stop == null) {
            stop = start || 0;
            start = 0;
          }
          step = step || 1;

          var length = Math.max(Math.ceil((stop - start) / step), 0);
          var range = Array(length);

          for (var idx = 0; idx < length; idx++, start += step) {
            range[idx] = start;
          }

          return range;
        };

        // Function (ahem) Functions
        // ------------------

        // Determines whether to execute a function as a constructor
        // or a normal function with the provided arguments
        var executeBound = function executeBound(sourceFunc, boundFunc, context, callingContext, args) {
          if (!(callingContext instanceof boundFunc)) return sourceFunc.apply(context, args);
          var self = baseCreate(sourceFunc.prototype);
          var result = sourceFunc.apply(self, args);
          if (_.isObject(result)) return result;
          return self;
        };

        // Create a function bound to a given object (assigning `this`, and arguments,
        // optionally). Delegates to **ECMAScript 5**'s native `Function.bind` if
        // available.
        _.bind = function (func, context) {
          if (nativeBind && func.bind === nativeBind) return nativeBind.apply(func, slice.call(arguments, 1));
          if (!_.isFunction(func)) throw new TypeError('Bind must be called on a function');
          var args = slice.call(arguments, 2);
          var bound = function bound() {
            return executeBound(func, bound, context, this, args.concat(slice.call(arguments)));
          };
          return bound;
        };

        // Partially apply a function by creating a version that has had some of its
        // arguments pre-filled, without changing its dynamic `this` context. _ acts
        // as a placeholder, allowing any combination of arguments to be pre-filled.
        _.partial = function (func) {
          var boundArgs = slice.call(arguments, 1);
          var bound = function bound() {
            var position = 0,
                length = boundArgs.length;
            var args = Array(length);
            for (var i = 0; i < length; i++) {
              args[i] = boundArgs[i] === _ ? arguments[position++] : boundArgs[i];
            }
            while (position < arguments.length) {
              args.push(arguments[position++]);
            }return executeBound(func, bound, this, this, args);
          };
          return bound;
        };

        // Bind a number of an object's methods to that object. Remaining arguments
        // are the method names to be bound. Useful for ensuring that all callbacks
        // defined on an object belong to it.
        _.bindAll = function (obj) {
          var i,
              length = arguments.length,
              key;
          if (length <= 1) throw new Error('bindAll must be passed function names');
          for (i = 1; i < length; i++) {
            key = arguments[i];
            obj[key] = _.bind(obj[key], obj);
          }
          return obj;
        };

        // Memoize an expensive function by storing its results.
        _.memoize = function (func, hasher) {
          var memoize = function memoize(key) {
            var cache = memoize.cache;
            var address = '' + (hasher ? hasher.apply(this, arguments) : key);
            if (!_.has(cache, address)) cache[address] = func.apply(this, arguments);
            return cache[address];
          };
          memoize.cache = {};
          return memoize;
        };

        // Delays a function for the given number of milliseconds, and then calls
        // it with the arguments supplied.
        _.delay = function (func, wait) {
          var args = slice.call(arguments, 2);
          return setTimeout(function () {
            return func.apply(null, args);
          }, wait);
        };

        // Defers a function, scheduling it to run after the current call stack has
        // cleared.
        _.defer = _.partial(_.delay, _, 1);

        // Returns a function, that, when invoked, will only be triggered at most once
        // during a given window of time. Normally, the throttled function will run
        // as much as it can, without ever going more than once per `wait` duration;
        // but if you'd like to disable the execution on the leading edge, pass
        // `{leading: false}`. To disable execution on the trailing edge, ditto.
        _.throttle = function (func, wait, options) {
          var context, args, result;
          var timeout = null;
          var previous = 0;
          if (!options) options = {};
          var later = function later() {
            previous = options.leading === false ? 0 : _.now();
            timeout = null;
            result = func.apply(context, args);
            if (!timeout) context = args = null;
          };
          return function () {
            var now = _.now();
            if (!previous && options.leading === false) previous = now;
            var remaining = wait - (now - previous);
            context = this;
            args = arguments;
            if (remaining <= 0 || remaining > wait) {
              if (timeout) {
                clearTimeout(timeout);
                timeout = null;
              }
              previous = now;
              result = func.apply(context, args);
              if (!timeout) context = args = null;
            } else if (!timeout && options.trailing !== false) {
              timeout = setTimeout(later, remaining);
            }
            return result;
          };
        };

        // Returns a function, that, as long as it continues to be invoked, will not
        // be triggered. The function will be called after it stops being called for
        // N milliseconds. If `immediate` is passed, trigger the function on the
        // leading edge, instead of the trailing.
        _.debounce = function (func, wait, immediate) {
          var timeout, args, context, timestamp, result;

          var later = function later() {
            var last = _.now() - timestamp;

            if (last < wait && last >= 0) {
              timeout = setTimeout(later, wait - last);
            } else {
              timeout = null;
              if (!immediate) {
                result = func.apply(context, args);
                if (!timeout) context = args = null;
              }
            }
          };

          return function () {
            context = this;
            args = arguments;
            timestamp = _.now();
            var callNow = immediate && !timeout;
            if (!timeout) timeout = setTimeout(later, wait);
            if (callNow) {
              result = func.apply(context, args);
              context = args = null;
            }

            return result;
          };
        };

        // Returns the first function passed as an argument to the second,
        // allowing you to adjust arguments, run code before and after, and
        // conditionally execute the original function.
        _.wrap = function (func, wrapper) {
          return _.partial(wrapper, func);
        };

        // Returns a negated version of the passed-in predicate.
        _.negate = function (predicate) {
          return function () {
            return !predicate.apply(this, arguments);
          };
        };

        // Returns a function that is the composition of a list of functions, each
        // consuming the return value of the function that follows.
        _.compose = function () {
          var args = arguments;
          var start = args.length - 1;
          return function () {
            var i = start;
            var result = args[start].apply(this, arguments);
            while (i--) {
              result = args[i].call(this, result);
            }return result;
          };
        };

        // Returns a function that will only be executed on and after the Nth call.
        _.after = function (times, func) {
          return function () {
            if (--times < 1) {
              return func.apply(this, arguments);
            }
          };
        };

        // Returns a function that will only be executed up to (but not including) the Nth call.
        _.before = function (times, func) {
          var memo;
          return function () {
            if (--times > 0) {
              memo = func.apply(this, arguments);
            }
            if (times <= 1) func = null;
            return memo;
          };
        };

        // Returns a function that will be executed at most one time, no matter how
        // often you call it. Useful for lazy initialization.
        _.once = _.partial(_.before, 2);

        // Object Functions
        // ----------------

        // Keys in IE < 9 that won't be iterated by `for key in ...` and thus missed.
        var hasEnumBug = !{ toString: null }.propertyIsEnumerable('toString');
        var nonEnumerableProps = ['valueOf', 'isPrototypeOf', 'toString', 'propertyIsEnumerable', 'hasOwnProperty', 'toLocaleString'];

        function collectNonEnumProps(obj, keys) {
          var nonEnumIdx = nonEnumerableProps.length;
          var constructor = obj.constructor;
          var proto = _.isFunction(constructor) && constructor.prototype || ObjProto;

          // Constructor is a special case.
          var prop = 'constructor';
          if (_.has(obj, prop) && !_.contains(keys, prop)) keys.push(prop);

          while (nonEnumIdx--) {
            prop = nonEnumerableProps[nonEnumIdx];
            if (prop in obj && obj[prop] !== proto[prop] && !_.contains(keys, prop)) {
              keys.push(prop);
            }
          }
        }

        // Retrieve the names of an object's own properties.
        // Delegates to **ECMAScript 5**'s native `Object.keys`
        _.keys = function (obj) {
          if (!_.isObject(obj)) return [];
          if (nativeKeys) return nativeKeys(obj);
          var keys = [];
          for (var key in obj) {
            if (_.has(obj, key)) keys.push(key);
          } // Ahem, IE < 9.
          if (hasEnumBug) collectNonEnumProps(obj, keys);
          return keys;
        };

        // Retrieve all the property names of an object.
        _.allKeys = function (obj) {
          if (!_.isObject(obj)) return [];
          var keys = [];
          for (var key in obj) {
            keys.push(key);
          } // Ahem, IE < 9.
          if (hasEnumBug) collectNonEnumProps(obj, keys);
          return keys;
        };

        // Retrieve the values of an object's properties.
        _.values = function (obj) {
          var keys = _.keys(obj);
          var length = keys.length;
          var values = Array(length);
          for (var i = 0; i < length; i++) {
            values[i] = obj[keys[i]];
          }
          return values;
        };

        // Returns the results of applying the iteratee to each element of the object
        // In contrast to _.map it returns an object
        _.mapObject = function (obj, iteratee, context) {
          iteratee = cb(iteratee, context);
          var keys = _.keys(obj),
              length = keys.length,
              results = {},
              currentKey;
          for (var index = 0; index < length; index++) {
            currentKey = keys[index];
            results[currentKey] = iteratee(obj[currentKey], currentKey, obj);
          }
          return results;
        };

        // Convert an object into a list of `[key, value]` pairs.
        _.pairs = function (obj) {
          var keys = _.keys(obj);
          var length = keys.length;
          var pairs = Array(length);
          for (var i = 0; i < length; i++) {
            pairs[i] = [keys[i], obj[keys[i]]];
          }
          return pairs;
        };

        // Invert the keys and values of an object. The values must be serializable.
        _.invert = function (obj) {
          var result = {};
          var keys = _.keys(obj);
          for (var i = 0, length = keys.length; i < length; i++) {
            result[obj[keys[i]]] = keys[i];
          }
          return result;
        };

        // Return a sorted list of the function names available on the object.
        // Aliased as `methods`
        _.functions = _.methods = function (obj) {
          var names = [];
          for (var key in obj) {
            if (_.isFunction(obj[key])) names.push(key);
          }
          return names.sort();
        };

        // Extend a given object with all the properties in passed-in object(s).
        _.extend = createAssigner(_.allKeys);

        // Assigns a given object with all the own properties in the passed-in object(s)
        // (https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object/assign)
        _.extendOwn = _.assign = createAssigner(_.keys);

        // Returns the first key on an object that passes a predicate test
        _.findKey = function (obj, predicate, context) {
          predicate = cb(predicate, context);
          var keys = _.keys(obj),
              key;
          for (var i = 0, length = keys.length; i < length; i++) {
            key = keys[i];
            if (predicate(obj[key], key, obj)) return key;
          }
        };

        // Return a copy of the object only containing the whitelisted properties.
        _.pick = function (object, oiteratee, context) {
          var result = {},
              obj = object,
              iteratee,
              keys;
          if (obj == null) return result;
          if (_.isFunction(oiteratee)) {
            keys = _.allKeys(obj);
            iteratee = optimizeCb(oiteratee, context);
          } else {
            keys = flatten(arguments, false, false, 1);
            iteratee = function iteratee(value, key, obj) {
              return key in obj;
            };
            obj = Object(obj);
          }
          for (var i = 0, length = keys.length; i < length; i++) {
            var key = keys[i];
            var value = obj[key];
            if (iteratee(value, key, obj)) result[key] = value;
          }
          return result;
        };

        // Return a copy of the object without the blacklisted properties.
        _.omit = function (obj, iteratee, context) {
          if (_.isFunction(iteratee)) {
            iteratee = _.negate(iteratee);
          } else {
            var keys = _.map(flatten(arguments, false, false, 1), String);
            iteratee = function iteratee(value, key) {
              return !_.contains(keys, key);
            };
          }
          return _.pick(obj, iteratee, context);
        };

        // Fill in a given object with default properties.
        _.defaults = createAssigner(_.allKeys, true);

        // Creates an object that inherits from the given prototype object.
        // If additional properties are provided then they will be added to the
        // created object.
        _.create = function (prototype, props) {
          var result = baseCreate(prototype);
          if (props) _.extendOwn(result, props);
          return result;
        };

        // Create a (shallow-cloned) duplicate of an object.
        _.clone = function (obj) {
          if (!_.isObject(obj)) return obj;
          return _.isArray(obj) ? obj.slice() : _.extend({}, obj);
        };

        // Invokes interceptor with the obj, and then returns obj.
        // The primary purpose of this method is to "tap into" a method chain, in
        // order to perform operations on intermediate results within the chain.
        _.tap = function (obj, interceptor) {
          interceptor(obj);
          return obj;
        };

        // Returns whether an object has a given set of `key:value` pairs.
        _.isMatch = function (object, attrs) {
          var keys = _.keys(attrs),
              length = keys.length;
          if (object == null) return !length;
          var obj = Object(object);
          for (var i = 0; i < length; i++) {
            var key = keys[i];
            if (attrs[key] !== obj[key] || !(key in obj)) return false;
          }
          return true;
        };

        // Internal recursive comparison function for `isEqual`.
        var eq = function eq(a, b, aStack, bStack) {
          // Identical objects are equal. `0 === -0`, but they aren't identical.
          // See the [Harmony `egal` proposal](http://wiki.ecmascript.org/doku.php?id=harmony:egal).
          if (a === b) return a !== 0 || 1 / a === 1 / b;
          // A strict comparison is necessary because `null == undefined`.
          if (a == null || b == null) return a === b;
          // Unwrap any wrapped objects.
          if (a instanceof _) a = a._wrapped;
          if (b instanceof _) b = b._wrapped;
          // Compare `[[Class]]` names.
          var className = toString.call(a);
          if (className !== toString.call(b)) return false;
          switch (className) {
            // Strings, numbers, regular expressions, dates, and booleans are compared by value.
            case '[object RegExp]':
            // RegExps are coerced to strings for comparison (Note: '' + /a/i === '/a/i')
            case '[object String]':
              // Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
              // equivalent to `new String("5")`.
              return '' + a === '' + b;
            case '[object Number]':
              // `NaN`s are equivalent, but non-reflexive.
              // Object(NaN) is equivalent to NaN
              if (+a !== +a) return +b !== +b;
              // An `egal` comparison is performed for other numeric values.
              return +a === 0 ? 1 / +a === 1 / b : +a === +b;
            case '[object Date]':
            case '[object Boolean]':
              // Coerce dates and booleans to numeric primitive values. Dates are compared by their
              // millisecond representations. Note that invalid dates with millisecond representations
              // of `NaN` are not equivalent.
              return +a === +b;
          }

          var areArrays = className === '[object Array]';
          if (!areArrays) {
            if ((typeof a === 'undefined' ? 'undefined' : _typeof2(a)) != 'object' || (typeof b === 'undefined' ? 'undefined' : _typeof2(b)) != 'object') return false;

            // Objects with different constructors are not equivalent, but `Object`s or `Array`s
            // from different frames are.
            var aCtor = a.constructor,
                bCtor = b.constructor;
            if (aCtor !== bCtor && !(_.isFunction(aCtor) && aCtor instanceof aCtor && _.isFunction(bCtor) && bCtor instanceof bCtor) && 'constructor' in a && 'constructor' in b) {
              return false;
            }
          }
          // Assume equality for cyclic structures. The algorithm for detecting cyclic
          // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.

          // Initializing stack of traversed objects.
          // It's done here since we only need them for objects and arrays comparison.
          aStack = aStack || [];
          bStack = bStack || [];
          var length = aStack.length;
          while (length--) {
            // Linear search. Performance is inversely proportional to the number of
            // unique nested structures.
            if (aStack[length] === a) return bStack[length] === b;
          }

          // Add the first object to the stack of traversed objects.
          aStack.push(a);
          bStack.push(b);

          // Recursively compare objects and arrays.
          if (areArrays) {
            // Compare array lengths to determine if a deep comparison is necessary.
            length = a.length;
            if (length !== b.length) return false;
            // Deep compare the contents, ignoring non-numeric properties.
            while (length--) {
              if (!eq(a[length], b[length], aStack, bStack)) return false;
            }
          } else {
            // Deep compare objects.
            var keys = _.keys(a),
                key;
            length = keys.length;
            // Ensure that both objects contain the same number of properties before comparing deep equality.
            if (_.keys(b).length !== length) return false;
            while (length--) {
              // Deep compare each member
              key = keys[length];
              if (!(_.has(b, key) && eq(a[key], b[key], aStack, bStack))) return false;
            }
          }
          // Remove the first object from the stack of traversed objects.
          aStack.pop();
          bStack.pop();
          return true;
        };

        // Perform a deep comparison to check if two objects are equal.
        _.isEqual = function (a, b) {
          return eq(a, b);
        };

        // Is a given array, string, or object empty?
        // An "empty" object has no enumerable own-properties.
        _.isEmpty = function (obj) {
          if (obj == null) return true;
          if (isArrayLike(obj) && (_.isArray(obj) || _.isString(obj) || _.isArguments(obj))) return obj.length === 0;
          return _.keys(obj).length === 0;
        };

        // Is a given value a DOM element?
        _.isElement = function (obj) {
          return !!(obj && obj.nodeType === 1);
        };

        // Is a given value an array?
        // Delegates to ECMA5's native Array.isArray
        _.isArray = nativeIsArray || function (obj) {
          return toString.call(obj) === '[object Array]';
        };

        // Is a given variable an object?
        _.isObject = function (obj) {
          var type = typeof obj === 'undefined' ? 'undefined' : _typeof2(obj);
          return type === 'function' || type === 'object' && !!obj;
        };

        // Add some isType methods: isArguments, isFunction, isString, isNumber, isDate, isRegExp, isError.
        _.each(['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp', 'Error'], function (name) {
          _['is' + name] = function (obj) {
            return toString.call(obj) === '[object ' + name + ']';
          };
        });

        // Define a fallback version of the method in browsers (ahem, IE < 9), where
        // there isn't any inspectable "Arguments" type.
        if (!_.isArguments(arguments)) {
          _.isArguments = function (obj) {
            return _.has(obj, 'callee');
          };
        }

        // Optimize `isFunction` if appropriate. Work around some typeof bugs in old v8,
        // IE 11 (#1621), and in Safari 8 (#1929).
        if (typeof /./ != 'function' && (typeof Int8Array === 'undefined' ? 'undefined' : _typeof2(Int8Array)) != 'object') {
          _.isFunction = function (obj) {
            return typeof obj == 'function' || false;
          };
        }

        // Is a given object a finite number?
        _.isFinite = function (obj) {
          return isFinite(obj) && !isNaN(parseFloat(obj));
        };

        // Is the given value `NaN`? (NaN is the only number which does not equal itself).
        _.isNaN = function (obj) {
          return _.isNumber(obj) && obj !== +obj;
        };

        // Is a given value a boolean?
        _.isBoolean = function (obj) {
          return obj === true || obj === false || toString.call(obj) === '[object Boolean]';
        };

        // Is a given value equal to null?
        _.isNull = function (obj) {
          return obj === null;
        };

        // Is a given variable undefined?
        _.isUndefined = function (obj) {
          return obj === void 0;
        };

        // Shortcut function for checking if an object has a given property directly
        // on itself (in other words, not on a prototype).
        _.has = function (obj, key) {
          return obj != null && hasOwnProperty.call(obj, key);
        };

        // Utility Functions
        // -----------------

        // Run Underscore.js in *noConflict* mode, returning the `_` variable to its
        // previous owner. Returns a reference to the Underscore object.
        _.noConflict = function () {
          root._ = previousUnderscore;
          return this;
        };

        // Keep the identity function around for default iteratees.
        _.identity = function (value) {
          return value;
        };

        // Predicate-generating functions. Often useful outside of Underscore.
        _.constant = function (value) {
          return function () {
            return value;
          };
        };

        _.noop = function () {};

        _.property = property;

        // Generates a function for a given object that returns a given property.
        _.propertyOf = function (obj) {
          return obj == null ? function () {} : function (key) {
            return obj[key];
          };
        };

        // Returns a predicate for checking whether an object has a given set of
        // `key:value` pairs.
        _.matcher = _.matches = function (attrs) {
          attrs = _.extendOwn({}, attrs);
          return function (obj) {
            return _.isMatch(obj, attrs);
          };
        };

        // Run a function **n** times.
        _.times = function (n, iteratee, context) {
          var accum = Array(Math.max(0, n));
          iteratee = optimizeCb(iteratee, context, 1);
          for (var i = 0; i < n; i++) {
            accum[i] = iteratee(i);
          }return accum;
        };

        // Return a random integer between min and max (inclusive).
        _.random = function (min, max) {
          if (max == null) {
            max = min;
            min = 0;
          }
          return min + Math.floor(Math.random() * (max - min + 1));
        };

        // A (possibly faster) way to get the current timestamp as an integer.
        _.now = Date.now || function () {
          return new Date().getTime();
        };

        // List of HTML entities for escaping.
        var escapeMap = {
          '&': '&amp;',
          '<': '&lt;',
          '>': '&gt;',
          '"': '&quot;',
          "'": '&#x27;',
          '`': '&#x60;'
        };
        var unescapeMap = _.invert(escapeMap);

        // Functions for escaping and unescaping strings to/from HTML interpolation.
        var createEscaper = function createEscaper(map) {
          var escaper = function escaper(match) {
            return map[match];
          };
          // Regexes for identifying a key that needs to be escaped
          var source = '(?:' + _.keys(map).join('|') + ')';
          var testRegexp = RegExp(source);
          var replaceRegexp = RegExp(source, 'g');
          return function (string) {
            string = string == null ? '' : '' + string;
            return testRegexp.test(string) ? string.replace(replaceRegexp, escaper) : string;
          };
        };
        _.escape = createEscaper(escapeMap);
        _.unescape = createEscaper(unescapeMap);

        // If the value of the named `property` is a function then invoke it with the
        // `object` as context; otherwise, return it.
        _.result = function (object, property, fallback) {
          var value = object == null ? void 0 : object[property];
          if (value === void 0) {
            value = fallback;
          }
          return _.isFunction(value) ? value.call(object) : value;
        };

        // Generate a unique integer id (unique within the entire client session).
        // Useful for temporary DOM ids.
        var idCounter = 0;
        _.uniqueId = function (prefix) {
          var id = ++idCounter + '';
          return prefix ? prefix + id : id;
        };

        // By default, Underscore uses ERB-style template delimiters, change the
        // following template settings to use alternative delimiters.
        _.templateSettings = {
          evaluate: /<%([\s\S]+?)%>/g,
          interpolate: /<%=([\s\S]+?)%>/g,
          escape: /<%-([\s\S]+?)%>/g
        };

        // When customizing `templateSettings`, if you don't want to define an
        // interpolation, evaluation or escaping regex, we need one that is
        // guaranteed not to match.
        var noMatch = /(.)^/;

        // Certain characters need to be escaped so that they can be put into a
        // string literal.
        var escapes = {
          "'": "'",
          '\\': '\\',
          '\r': 'r',
          '\n': 'n',
          '\u2028': 'u2028',
          '\u2029': 'u2029'
        };

        var escaper = /\\|'|\r|\n|\u2028|\u2029/g;

        var escapeChar = function escapeChar(match) {
          return '\\' + escapes[match];
        };

        // JavaScript micro-templating, similar to John Resig's implementation.
        // Underscore templating handles arbitrary delimiters, preserves whitespace,
        // and correctly escapes quotes within interpolated code.
        // NB: `oldSettings` only exists for backwards compatibility.
        _.template = function (text, settings, oldSettings) {
          if (!settings && oldSettings) settings = oldSettings;
          settings = _.defaults({}, settings, _.templateSettings);

          // Combine delimiters into one regular expression via alternation.
          var matcher = RegExp([(settings.escape || noMatch).source, (settings.interpolate || noMatch).source, (settings.evaluate || noMatch).source].join('|') + '|$', 'g');

          // Compile the template source, escaping string literals appropriately.
          var index = 0;
          var source = "__p+='";
          text.replace(matcher, function (match, escape, interpolate, evaluate, offset) {
            source += text.slice(index, offset).replace(escaper, escapeChar);
            index = offset + match.length;

            if (escape) {
              source += "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'";
            } else if (interpolate) {
              source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
            } else if (evaluate) {
              source += "';\n" + evaluate + "\n__p+='";
            }

            // Adobe VMs need the match returned to produce the correct offest.
            return match;
          });
          source += "';\n";

          // If a variable is not specified, place data values in local scope.
          if (!settings.variable) source = 'with(obj||{}){\n' + source + '}\n';

          source = "var __t,__p='',__j=Array.prototype.join," + "print=function(){__p+=__j.call(arguments,'');};\n" + source + 'return __p;\n';

          try {
            var render = new Function(settings.variable || 'obj', '_', source);
          } catch (e) {
            e.source = source;
            throw e;
          }

          var template = function template(data) {
            return render.call(this, data, _);
          };

          // Provide the compiled source as a convenience for precompilation.
          var argument = settings.variable || 'obj';
          template.source = 'function(' + argument + '){\n' + source + '}';

          return template;
        };

        // Add a "chain" function. Start chaining a wrapped Underscore object.
        _.chain = function (obj) {
          var instance = _(obj);
          instance._chain = true;
          return instance;
        };

        // OOP
        // ---------------
        // If Underscore is called as a function, it returns a wrapped object that
        // can be used OO-style. This wrapper holds altered versions of all the
        // underscore functions. Wrapped objects may be chained.

        // Helper function to continue chaining intermediate results.
        var result = function result(instance, obj) {
          return instance._chain ? _(obj).chain() : obj;
        };

        // Add your own custom functions to the Underscore object.
        _.mixin = function (obj) {
          _.each(_.functions(obj), function (name) {
            var func = _[name] = obj[name];
            _.prototype[name] = function () {
              var args = [this._wrapped];
              push.apply(args, arguments);
              return result(this, func.apply(_, args));
            };
          });
        };

        // Add all of the Underscore functions to the wrapper object.
        _.mixin(_);

        // Add all mutator Array functions to the wrapper.
        _.each(['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'], function (name) {
          var method = ArrayProto[name];
          _.prototype[name] = function () {
            var obj = this._wrapped;
            method.apply(obj, arguments);
            if ((name === 'shift' || name === 'splice') && obj.length === 0) delete obj[0];
            return result(this, obj);
          };
        });

        // Add all accessor Array functions to the wrapper.
        _.each(['concat', 'join', 'slice'], function (name) {
          var method = ArrayProto[name];
          _.prototype[name] = function () {
            return result(this, method.apply(this._wrapped, arguments));
          };
        });

        // Extracts the result from a wrapped and chained object.
        _.prototype.value = function () {
          return this._wrapped;
        };

        // Provide unwrapping proxy for some methods used in engine operations
        // such as arithmetic and JSON stringification.
        _.prototype.valueOf = _.prototype.toJSON = _.prototype.value;

        _.prototype.toString = function () {
          return '' + this._wrapped;
        };

        // AMD registration happens at the end for compatibility with AMD loaders
        // that may not enforce next-turn semantics on modules. Even though general
        // practice for AMD registration is to be anonymous, underscore registers
        // as a named module because, like jQuery, it is a base library that is
        // popular enough to be bundled in a third party lib, but not be part of
        // an AMD load request. Those cases could generate an error when an
        // anonymous define() is called outside of a loader request.
        if (true) {
          !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = function () {
            return _;
          }.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
        }
      }).call(this);

      /***/
    }]
    /******/)
  );
});
//# sourceMappingURL=role-hierarchy.js.map
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(6)(module)))

/***/ }),
/* 6 */
/***/ (function(module, exports) {

module.exports = function(module) {
	if(!module.webpackPolyfill) {
		module.deprecate = function() {};
		module.paths = [];
		// module.parent = undefined by default
		if(!module.children) module.children = [];
		Object.defineProperty(module, "loaded", {
			enumerable: true,
			get: function() {
				return module.l;
			}
		});
		Object.defineProperty(module, "id", {
			enumerable: true,
			get: function() {
				return module.i;
			}
		});
		module.webpackPolyfill = 1;
	}
	return module;
};


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {

// compare and isBuffer taken from https://github.com/feross/buffer/blob/680e9e5e488f22aac27599a57dc844a6315928dd/index.js
// original notice:

/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */
function compare(a, b) {
  if (a === b) {
    return 0;
  }

  var x = a.length;
  var y = b.length;

  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i];
      y = b[i];
      break;
    }
  }

  if (x < y) {
    return -1;
  }
  if (y < x) {
    return 1;
  }
  return 0;
}
function isBuffer(b) {
  if (global.Buffer && typeof global.Buffer.isBuffer === 'function') {
    return global.Buffer.isBuffer(b);
  }
  return !!(b != null && b._isBuffer);
}

// based on node assert, original notice:

// http://wiki.commonjs.org/wiki/Unit_Testing/1.0
//
// THIS IS NOT TESTED NOR LIKELY TO WORK OUTSIDE V8!
//
// Originally from narwhal.js (http://narwhaljs.org)
// Copyright (c) 2009 Thomas Robinson <280north.com>
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the 'Software'), to
// deal in the Software without restriction, including without limitation the
// rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
// sell copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
// ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
// WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

var util = __webpack_require__(8);
var hasOwn = Object.prototype.hasOwnProperty;
var pSlice = Array.prototype.slice;
var functionsHaveNames = (function () {
  return function foo() {}.name === 'foo';
}());
function pToString (obj) {
  return Object.prototype.toString.call(obj);
}
function isView(arrbuf) {
  if (isBuffer(arrbuf)) {
    return false;
  }
  if (typeof global.ArrayBuffer !== 'function') {
    return false;
  }
  if (typeof ArrayBuffer.isView === 'function') {
    return ArrayBuffer.isView(arrbuf);
  }
  if (!arrbuf) {
    return false;
  }
  if (arrbuf instanceof DataView) {
    return true;
  }
  if (arrbuf.buffer && arrbuf.buffer instanceof ArrayBuffer) {
    return true;
  }
  return false;
}
// 1. The assert module provides functions that throw
// AssertionError's when particular conditions are not met. The
// assert module must conform to the following interface.

var assert = module.exports = ok;

// 2. The AssertionError is defined in assert.
// new assert.AssertionError({ message: message,
//                             actual: actual,
//                             expected: expected })

var regex = /\s*function\s+([^\(\s]*)\s*/;
// based on https://github.com/ljharb/function.prototype.name/blob/adeeeec8bfcc6068b187d7d9fb3d5bb1d3a30899/implementation.js
function getName(func) {
  if (!util.isFunction(func)) {
    return;
  }
  if (functionsHaveNames) {
    return func.name;
  }
  var str = func.toString();
  var match = str.match(regex);
  return match && match[1];
}
assert.AssertionError = function AssertionError(options) {
  this.name = 'AssertionError';
  this.actual = options.actual;
  this.expected = options.expected;
  this.operator = options.operator;
  if (options.message) {
    this.message = options.message;
    this.generatedMessage = false;
  } else {
    this.message = getMessage(this);
    this.generatedMessage = true;
  }
  var stackStartFunction = options.stackStartFunction || fail;
  if (Error.captureStackTrace) {
    Error.captureStackTrace(this, stackStartFunction);
  } else {
    // non v8 browsers so we can have a stacktrace
    var err = new Error();
    if (err.stack) {
      var out = err.stack;

      // try to strip useless frames
      var fn_name = getName(stackStartFunction);
      var idx = out.indexOf('\n' + fn_name);
      if (idx >= 0) {
        // once we have located the function frame
        // we need to strip out everything before it (and its line)
        var next_line = out.indexOf('\n', idx + 1);
        out = out.substring(next_line + 1);
      }

      this.stack = out;
    }
  }
};

// assert.AssertionError instanceof Error
util.inherits(assert.AssertionError, Error);

function truncate(s, n) {
  if (typeof s === 'string') {
    return s.length < n ? s : s.slice(0, n);
  } else {
    return s;
  }
}
function inspect(something) {
  if (functionsHaveNames || !util.isFunction(something)) {
    return util.inspect(something);
  }
  var rawname = getName(something);
  var name = rawname ? ': ' + rawname : '';
  return '[Function' +  name + ']';
}
function getMessage(self) {
  return truncate(inspect(self.actual), 128) + ' ' +
         self.operator + ' ' +
         truncate(inspect(self.expected), 128);
}

// At present only the three keys mentioned above are used and
// understood by the spec. Implementations or sub modules can pass
// other keys to the AssertionError's constructor - they will be
// ignored.

// 3. All of the following functions must throw an AssertionError
// when a corresponding condition is not met, with a message that
// may be undefined if not provided.  All assertion methods provide
// both the actual and expected values to the assertion error for
// display purposes.

function fail(actual, expected, message, operator, stackStartFunction) {
  throw new assert.AssertionError({
    message: message,
    actual: actual,
    expected: expected,
    operator: operator,
    stackStartFunction: stackStartFunction
  });
}

// EXTENSION! allows for well behaved errors defined elsewhere.
assert.fail = fail;

// 4. Pure assertion tests whether a value is truthy, as determined
// by !!guard.
// assert.ok(guard, message_opt);
// This statement is equivalent to assert.equal(true, !!guard,
// message_opt);. To test strictly for the value true, use
// assert.strictEqual(true, guard, message_opt);.

function ok(value, message) {
  if (!value) fail(value, true, message, '==', assert.ok);
}
assert.ok = ok;

// 5. The equality assertion tests shallow, coercive equality with
// ==.
// assert.equal(actual, expected, message_opt);

assert.equal = function equal(actual, expected, message) {
  if (actual != expected) fail(actual, expected, message, '==', assert.equal);
};

// 6. The non-equality assertion tests for whether two objects are not equal
// with != assert.notEqual(actual, expected, message_opt);

assert.notEqual = function notEqual(actual, expected, message) {
  if (actual == expected) {
    fail(actual, expected, message, '!=', assert.notEqual);
  }
};

// 7. The equivalence assertion tests a deep equality relation.
// assert.deepEqual(actual, expected, message_opt);

assert.deepEqual = function deepEqual(actual, expected, message) {
  if (!_deepEqual(actual, expected, false)) {
    fail(actual, expected, message, 'deepEqual', assert.deepEqual);
  }
};

assert.deepStrictEqual = function deepStrictEqual(actual, expected, message) {
  if (!_deepEqual(actual, expected, true)) {
    fail(actual, expected, message, 'deepStrictEqual', assert.deepStrictEqual);
  }
};

function _deepEqual(actual, expected, strict, memos) {
  // 7.1. All identical values are equivalent, as determined by ===.
  if (actual === expected) {
    return true;
  } else if (isBuffer(actual) && isBuffer(expected)) {
    return compare(actual, expected) === 0;

  // 7.2. If the expected value is a Date object, the actual value is
  // equivalent if it is also a Date object that refers to the same time.
  } else if (util.isDate(actual) && util.isDate(expected)) {
    return actual.getTime() === expected.getTime();

  // 7.3 If the expected value is a RegExp object, the actual value is
  // equivalent if it is also a RegExp object with the same source and
  // properties (`global`, `multiline`, `lastIndex`, `ignoreCase`).
  } else if (util.isRegExp(actual) && util.isRegExp(expected)) {
    return actual.source === expected.source &&
           actual.global === expected.global &&
           actual.multiline === expected.multiline &&
           actual.lastIndex === expected.lastIndex &&
           actual.ignoreCase === expected.ignoreCase;

  // 7.4. Other pairs that do not both pass typeof value == 'object',
  // equivalence is determined by ==.
  } else if ((actual === null || typeof actual !== 'object') &&
             (expected === null || typeof expected !== 'object')) {
    return strict ? actual === expected : actual == expected;

  // If both values are instances of typed arrays, wrap their underlying
  // ArrayBuffers in a Buffer each to increase performance
  // This optimization requires the arrays to have the same type as checked by
  // Object.prototype.toString (aka pToString). Never perform binary
  // comparisons for Float*Arrays, though, since e.g. +0 === -0 but their
  // bit patterns are not identical.
  } else if (isView(actual) && isView(expected) &&
             pToString(actual) === pToString(expected) &&
             !(actual instanceof Float32Array ||
               actual instanceof Float64Array)) {
    return compare(new Uint8Array(actual.buffer),
                   new Uint8Array(expected.buffer)) === 0;

  // 7.5 For all other Object pairs, including Array objects, equivalence is
  // determined by having the same number of owned properties (as verified
  // with Object.prototype.hasOwnProperty.call), the same set of keys
  // (although not necessarily the same order), equivalent values for every
  // corresponding key, and an identical 'prototype' property. Note: this
  // accounts for both named and indexed properties on Arrays.
  } else if (isBuffer(actual) !== isBuffer(expected)) {
    return false;
  } else {
    memos = memos || {actual: [], expected: []};

    var actualIndex = memos.actual.indexOf(actual);
    if (actualIndex !== -1) {
      if (actualIndex === memos.expected.indexOf(expected)) {
        return true;
      }
    }

    memos.actual.push(actual);
    memos.expected.push(expected);

    return objEquiv(actual, expected, strict, memos);
  }
}

function isArguments(object) {
  return Object.prototype.toString.call(object) == '[object Arguments]';
}

function objEquiv(a, b, strict, actualVisitedObjects) {
  if (a === null || a === undefined || b === null || b === undefined)
    return false;
  // if one is a primitive, the other must be same
  if (util.isPrimitive(a) || util.isPrimitive(b))
    return a === b;
  if (strict && Object.getPrototypeOf(a) !== Object.getPrototypeOf(b))
    return false;
  var aIsArgs = isArguments(a);
  var bIsArgs = isArguments(b);
  if ((aIsArgs && !bIsArgs) || (!aIsArgs && bIsArgs))
    return false;
  if (aIsArgs) {
    a = pSlice.call(a);
    b = pSlice.call(b);
    return _deepEqual(a, b, strict);
  }
  var ka = objectKeys(a);
  var kb = objectKeys(b);
  var key, i;
  // having the same number of owned properties (keys incorporates
  // hasOwnProperty)
  if (ka.length !== kb.length)
    return false;
  //the same set of keys (although not necessarily the same order),
  ka.sort();
  kb.sort();
  //~~~cheap key test
  for (i = ka.length - 1; i >= 0; i--) {
    if (ka[i] !== kb[i])
      return false;
  }
  //equivalent values for every corresponding key, and
  //~~~possibly expensive deep test
  for (i = ka.length - 1; i >= 0; i--) {
    key = ka[i];
    if (!_deepEqual(a[key], b[key], strict, actualVisitedObjects))
      return false;
  }
  return true;
}

// 8. The non-equivalence assertion tests for any deep inequality.
// assert.notDeepEqual(actual, expected, message_opt);

assert.notDeepEqual = function notDeepEqual(actual, expected, message) {
  if (_deepEqual(actual, expected, false)) {
    fail(actual, expected, message, 'notDeepEqual', assert.notDeepEqual);
  }
};

assert.notDeepStrictEqual = notDeepStrictEqual;
function notDeepStrictEqual(actual, expected, message) {
  if (_deepEqual(actual, expected, true)) {
    fail(actual, expected, message, 'notDeepStrictEqual', notDeepStrictEqual);
  }
}


// 9. The strict equality assertion tests strict equality, as determined by ===.
// assert.strictEqual(actual, expected, message_opt);

assert.strictEqual = function strictEqual(actual, expected, message) {
  if (actual !== expected) {
    fail(actual, expected, message, '===', assert.strictEqual);
  }
};

// 10. The strict non-equality assertion tests for strict inequality, as
// determined by !==.  assert.notStrictEqual(actual, expected, message_opt);

assert.notStrictEqual = function notStrictEqual(actual, expected, message) {
  if (actual === expected) {
    fail(actual, expected, message, '!==', assert.notStrictEqual);
  }
};

function expectedException(actual, expected) {
  if (!actual || !expected) {
    return false;
  }

  if (Object.prototype.toString.call(expected) == '[object RegExp]') {
    return expected.test(actual);
  }

  try {
    if (actual instanceof expected) {
      return true;
    }
  } catch (e) {
    // Ignore.  The instanceof check doesn't work for arrow functions.
  }

  if (Error.isPrototypeOf(expected)) {
    return false;
  }

  return expected.call({}, actual) === true;
}

function _tryBlock(block) {
  var error;
  try {
    block();
  } catch (e) {
    error = e;
  }
  return error;
}

function _throws(shouldThrow, block, expected, message) {
  var actual;

  if (typeof block !== 'function') {
    throw new TypeError('"block" argument must be a function');
  }

  if (typeof expected === 'string') {
    message = expected;
    expected = null;
  }

  actual = _tryBlock(block);

  message = (expected && expected.name ? ' (' + expected.name + ').' : '.') +
            (message ? ' ' + message : '.');

  if (shouldThrow && !actual) {
    fail(actual, expected, 'Missing expected exception' + message);
  }

  var userProvidedMessage = typeof message === 'string';
  var isUnwantedException = !shouldThrow && util.isError(actual);
  var isUnexpectedException = !shouldThrow && actual && !expected;

  if ((isUnwantedException &&
      userProvidedMessage &&
      expectedException(actual, expected)) ||
      isUnexpectedException) {
    fail(actual, expected, 'Got unwanted exception' + message);
  }

  if ((shouldThrow && actual && expected &&
      !expectedException(actual, expected)) || (!shouldThrow && actual)) {
    throw actual;
  }
}

// 11. Expected to throw an error:
// assert.throws(block, Error_opt, message_opt);

assert.throws = function(block, /*optional*/error, /*optional*/message) {
  _throws(true, block, error, message);
};

// EXTENSION! This is annoying to write outside this module.
assert.doesNotThrow = function(block, /*optional*/error, /*optional*/message) {
  _throws(false, block, error, message);
};

assert.ifError = function(err) { if (err) throw err; };

var objectKeys = Object.keys || function (obj) {
  var keys = [];
  for (var key in obj) {
    if (hasOwn.call(obj, key)) keys.push(key);
  }
  return keys;
};

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0)))

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global, process) {// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var formatRegExp = /%[sdj%]/g;
exports.format = function(f) {
  if (!isString(f)) {
    var objects = [];
    for (var i = 0; i < arguments.length; i++) {
      objects.push(inspect(arguments[i]));
    }
    return objects.join(' ');
  }

  var i = 1;
  var args = arguments;
  var len = args.length;
  var str = String(f).replace(formatRegExp, function(x) {
    if (x === '%%') return '%';
    if (i >= len) return x;
    switch (x) {
      case '%s': return String(args[i++]);
      case '%d': return Number(args[i++]);
      case '%j':
        try {
          return JSON.stringify(args[i++]);
        } catch (_) {
          return '[Circular]';
        }
      default:
        return x;
    }
  });
  for (var x = args[i]; i < len; x = args[++i]) {
    if (isNull(x) || !isObject(x)) {
      str += ' ' + x;
    } else {
      str += ' ' + inspect(x);
    }
  }
  return str;
};


// Mark that a method should not be used.
// Returns a modified function which warns once by default.
// If --no-deprecation is set, then it is a no-op.
exports.deprecate = function(fn, msg) {
  // Allow for deprecating things in the process of starting up.
  if (isUndefined(global.process)) {
    return function() {
      return exports.deprecate(fn, msg).apply(this, arguments);
    };
  }

  if (process.noDeprecation === true) {
    return fn;
  }

  var warned = false;
  function deprecated() {
    if (!warned) {
      if (process.throwDeprecation) {
        throw new Error(msg);
      } else if (process.traceDeprecation) {
        console.trace(msg);
      } else {
        console.error(msg);
      }
      warned = true;
    }
    return fn.apply(this, arguments);
  }

  return deprecated;
};


var debugs = {};
var debugEnviron;
exports.debuglog = function(set) {
  if (isUndefined(debugEnviron))
    debugEnviron = process.env.NODE_DEBUG || '';
  set = set.toUpperCase();
  if (!debugs[set]) {
    if (new RegExp('\\b' + set + '\\b', 'i').test(debugEnviron)) {
      var pid = process.pid;
      debugs[set] = function() {
        var msg = exports.format.apply(exports, arguments);
        console.error('%s %d: %s', set, pid, msg);
      };
    } else {
      debugs[set] = function() {};
    }
  }
  return debugs[set];
};


/**
 * Echos the value of a value. Trys to print the value out
 * in the best way possible given the different types.
 *
 * @param {Object} obj The object to print out.
 * @param {Object} opts Optional options object that alters the output.
 */
/* legacy: obj, showHidden, depth, colors*/
function inspect(obj, opts) {
  // default options
  var ctx = {
    seen: [],
    stylize: stylizeNoColor
  };
  // legacy...
  if (arguments.length >= 3) ctx.depth = arguments[2];
  if (arguments.length >= 4) ctx.colors = arguments[3];
  if (isBoolean(opts)) {
    // legacy...
    ctx.showHidden = opts;
  } else if (opts) {
    // got an "options" object
    exports._extend(ctx, opts);
  }
  // set default options
  if (isUndefined(ctx.showHidden)) ctx.showHidden = false;
  if (isUndefined(ctx.depth)) ctx.depth = 2;
  if (isUndefined(ctx.colors)) ctx.colors = false;
  if (isUndefined(ctx.customInspect)) ctx.customInspect = true;
  if (ctx.colors) ctx.stylize = stylizeWithColor;
  return formatValue(ctx, obj, ctx.depth);
}
exports.inspect = inspect;


// http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
inspect.colors = {
  'bold' : [1, 22],
  'italic' : [3, 23],
  'underline' : [4, 24],
  'inverse' : [7, 27],
  'white' : [37, 39],
  'grey' : [90, 39],
  'black' : [30, 39],
  'blue' : [34, 39],
  'cyan' : [36, 39],
  'green' : [32, 39],
  'magenta' : [35, 39],
  'red' : [31, 39],
  'yellow' : [33, 39]
};

// Don't use 'blue' not visible on cmd.exe
inspect.styles = {
  'special': 'cyan',
  'number': 'yellow',
  'boolean': 'yellow',
  'undefined': 'grey',
  'null': 'bold',
  'string': 'green',
  'date': 'magenta',
  // "name": intentionally not styling
  'regexp': 'red'
};


function stylizeWithColor(str, styleType) {
  var style = inspect.styles[styleType];

  if (style) {
    return '\u001b[' + inspect.colors[style][0] + 'm' + str +
           '\u001b[' + inspect.colors[style][1] + 'm';
  } else {
    return str;
  }
}


function stylizeNoColor(str, styleType) {
  return str;
}


function arrayToHash(array) {
  var hash = {};

  array.forEach(function(val, idx) {
    hash[val] = true;
  });

  return hash;
}


function formatValue(ctx, value, recurseTimes) {
  // Provide a hook for user-specified inspect functions.
  // Check that value is an object with an inspect function on it
  if (ctx.customInspect &&
      value &&
      isFunction(value.inspect) &&
      // Filter out the util module, it's inspect function is special
      value.inspect !== exports.inspect &&
      // Also filter out any prototype objects using the circular check.
      !(value.constructor && value.constructor.prototype === value)) {
    var ret = value.inspect(recurseTimes, ctx);
    if (!isString(ret)) {
      ret = formatValue(ctx, ret, recurseTimes);
    }
    return ret;
  }

  // Primitive types cannot have properties
  var primitive = formatPrimitive(ctx, value);
  if (primitive) {
    return primitive;
  }

  // Look up the keys of the object.
  var keys = Object.keys(value);
  var visibleKeys = arrayToHash(keys);

  if (ctx.showHidden) {
    keys = Object.getOwnPropertyNames(value);
  }

  // IE doesn't make error fields non-enumerable
  // http://msdn.microsoft.com/en-us/library/ie/dww52sbt(v=vs.94).aspx
  if (isError(value)
      && (keys.indexOf('message') >= 0 || keys.indexOf('description') >= 0)) {
    return formatError(value);
  }

  // Some type of object without properties can be shortcutted.
  if (keys.length === 0) {
    if (isFunction(value)) {
      var name = value.name ? ': ' + value.name : '';
      return ctx.stylize('[Function' + name + ']', 'special');
    }
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    }
    if (isDate(value)) {
      return ctx.stylize(Date.prototype.toString.call(value), 'date');
    }
    if (isError(value)) {
      return formatError(value);
    }
  }

  var base = '', array = false, braces = ['{', '}'];

  // Make Array say that they are Array
  if (isArray(value)) {
    array = true;
    braces = ['[', ']'];
  }

  // Make functions say that they are functions
  if (isFunction(value)) {
    var n = value.name ? ': ' + value.name : '';
    base = ' [Function' + n + ']';
  }

  // Make RegExps say that they are RegExps
  if (isRegExp(value)) {
    base = ' ' + RegExp.prototype.toString.call(value);
  }

  // Make dates with properties first say the date
  if (isDate(value)) {
    base = ' ' + Date.prototype.toUTCString.call(value);
  }

  // Make error with message first say the error
  if (isError(value)) {
    base = ' ' + formatError(value);
  }

  if (keys.length === 0 && (!array || value.length == 0)) {
    return braces[0] + base + braces[1];
  }

  if (recurseTimes < 0) {
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    } else {
      return ctx.stylize('[Object]', 'special');
    }
  }

  ctx.seen.push(value);

  var output;
  if (array) {
    output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
  } else {
    output = keys.map(function(key) {
      return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
    });
  }

  ctx.seen.pop();

  return reduceToSingleString(output, base, braces);
}


function formatPrimitive(ctx, value) {
  if (isUndefined(value))
    return ctx.stylize('undefined', 'undefined');
  if (isString(value)) {
    var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '')
                                             .replace(/'/g, "\\'")
                                             .replace(/\\"/g, '"') + '\'';
    return ctx.stylize(simple, 'string');
  }
  if (isNumber(value))
    return ctx.stylize('' + value, 'number');
  if (isBoolean(value))
    return ctx.stylize('' + value, 'boolean');
  // For some reason typeof null is "object", so special case here.
  if (isNull(value))
    return ctx.stylize('null', 'null');
}


function formatError(value) {
  return '[' + Error.prototype.toString.call(value) + ']';
}


function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
  var output = [];
  for (var i = 0, l = value.length; i < l; ++i) {
    if (hasOwnProperty(value, String(i))) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          String(i), true));
    } else {
      output.push('');
    }
  }
  keys.forEach(function(key) {
    if (!key.match(/^\d+$/)) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          key, true));
    }
  });
  return output;
}


function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
  var name, str, desc;
  desc = Object.getOwnPropertyDescriptor(value, key) || { value: value[key] };
  if (desc.get) {
    if (desc.set) {
      str = ctx.stylize('[Getter/Setter]', 'special');
    } else {
      str = ctx.stylize('[Getter]', 'special');
    }
  } else {
    if (desc.set) {
      str = ctx.stylize('[Setter]', 'special');
    }
  }
  if (!hasOwnProperty(visibleKeys, key)) {
    name = '[' + key + ']';
  }
  if (!str) {
    if (ctx.seen.indexOf(desc.value) < 0) {
      if (isNull(recurseTimes)) {
        str = formatValue(ctx, desc.value, null);
      } else {
        str = formatValue(ctx, desc.value, recurseTimes - 1);
      }
      if (str.indexOf('\n') > -1) {
        if (array) {
          str = str.split('\n').map(function(line) {
            return '  ' + line;
          }).join('\n').substr(2);
        } else {
          str = '\n' + str.split('\n').map(function(line) {
            return '   ' + line;
          }).join('\n');
        }
      }
    } else {
      str = ctx.stylize('[Circular]', 'special');
    }
  }
  if (isUndefined(name)) {
    if (array && key.match(/^\d+$/)) {
      return str;
    }
    name = JSON.stringify('' + key);
    if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
      name = name.substr(1, name.length - 2);
      name = ctx.stylize(name, 'name');
    } else {
      name = name.replace(/'/g, "\\'")
                 .replace(/\\"/g, '"')
                 .replace(/(^"|"$)/g, "'");
      name = ctx.stylize(name, 'string');
    }
  }

  return name + ': ' + str;
}


function reduceToSingleString(output, base, braces) {
  var numLinesEst = 0;
  var length = output.reduce(function(prev, cur) {
    numLinesEst++;
    if (cur.indexOf('\n') >= 0) numLinesEst++;
    return prev + cur.replace(/\u001b\[\d\d?m/g, '').length + 1;
  }, 0);

  if (length > 60) {
    return braces[0] +
           (base === '' ? '' : base + '\n ') +
           ' ' +
           output.join(',\n  ') +
           ' ' +
           braces[1];
  }

  return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
}


// NOTE: These type checking functions intentionally don't use `instanceof`
// because it is fragile and can be easily faked with `Object.create()`.
function isArray(ar) {
  return Array.isArray(ar);
}
exports.isArray = isArray;

function isBoolean(arg) {
  return typeof arg === 'boolean';
}
exports.isBoolean = isBoolean;

function isNull(arg) {
  return arg === null;
}
exports.isNull = isNull;

function isNullOrUndefined(arg) {
  return arg == null;
}
exports.isNullOrUndefined = isNullOrUndefined;

function isNumber(arg) {
  return typeof arg === 'number';
}
exports.isNumber = isNumber;

function isString(arg) {
  return typeof arg === 'string';
}
exports.isString = isString;

function isSymbol(arg) {
  return typeof arg === 'symbol';
}
exports.isSymbol = isSymbol;

function isUndefined(arg) {
  return arg === void 0;
}
exports.isUndefined = isUndefined;

function isRegExp(re) {
  return isObject(re) && objectToString(re) === '[object RegExp]';
}
exports.isRegExp = isRegExp;

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}
exports.isObject = isObject;

function isDate(d) {
  return isObject(d) && objectToString(d) === '[object Date]';
}
exports.isDate = isDate;

function isError(e) {
  return isObject(e) &&
      (objectToString(e) === '[object Error]' || e instanceof Error);
}
exports.isError = isError;

function isFunction(arg) {
  return typeof arg === 'function';
}
exports.isFunction = isFunction;

function isPrimitive(arg) {
  return arg === null ||
         typeof arg === 'boolean' ||
         typeof arg === 'number' ||
         typeof arg === 'string' ||
         typeof arg === 'symbol' ||  // ES6 symbol
         typeof arg === 'undefined';
}
exports.isPrimitive = isPrimitive;

exports.isBuffer = __webpack_require__(10);

function objectToString(o) {
  return Object.prototype.toString.call(o);
}


function pad(n) {
  return n < 10 ? '0' + n.toString(10) : n.toString(10);
}


var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
              'Oct', 'Nov', 'Dec'];

// 26 Feb 16:19:34
function timestamp() {
  var d = new Date();
  var time = [pad(d.getHours()),
              pad(d.getMinutes()),
              pad(d.getSeconds())].join(':');
  return [d.getDate(), months[d.getMonth()], time].join(' ');
}


// log is just a thin wrapper to console.log that prepends a timestamp
exports.log = function() {
  console.log('%s - %s', timestamp(), exports.format.apply(exports, arguments));
};


/**
 * Inherit the prototype methods from one constructor into another.
 *
 * The Function.prototype.inherits from lang.js rewritten as a standalone
 * function (not on Function.prototype). NOTE: If this file is to be loaded
 * during bootstrapping this function needs to be rewritten using some native
 * functions as prototype setup using normal JavaScript does not work as
 * expected during bootstrapping (see mirror.js in r114903).
 *
 * @param {function} ctor Constructor function which needs to inherit the
 *     prototype.
 * @param {function} superCtor Constructor function to inherit prototype from.
 */
exports.inherits = __webpack_require__(11);

exports._extend = function(origin, add) {
  // Don't do anything if add isn't an object
  if (!add || !isObject(add)) return origin;

  var keys = Object.keys(add);
  var i = keys.length;
  while (i--) {
    origin[keys[i]] = add[keys[i]];
  }
  return origin;
};

function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0), __webpack_require__(9)))

/***/ }),
/* 9 */
/***/ (function(module, exports) {

// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };


/***/ }),
/* 10 */
/***/ (function(module, exports) {

module.exports = function isBuffer(arg) {
  return arg && typeof arg === 'object'
    && typeof arg.copy === 'function'
    && typeof arg.fill === 'function'
    && typeof arg.readUInt8 === 'function';
}

/***/ }),
/* 11 */
/***/ (function(module, exports) {

if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    ctor.prototype = Object.create(superCtor.prototype, {
      constructor: {
        value: ctor,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    var TempCtor = function () {}
    TempCtor.prototype = superCtor.prototype
    ctor.prototype = new TempCtor()
    ctor.prototype.constructor = ctor
  }
}


/***/ }),
/* 12 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_12__;

/***/ }),
/* 13 */
/***/ (function(module, exports) {

module.exports = {"rolesHierarchyConfig":{"loggingConfig":{"level":"info","timestamp":true,"colorize":true},"treeModelConfig":{"childrenPropertyName":"subordinates"},"rolesHierarchy":{"name":"admin","subordinates":[{"name":"user-admin","subordinates":[{"name":"schoolAdmin","subordinates":[{"name":"teacher","subordinates":[{"name":"student","visibleUserFields":{"_id":1,"username":1,"profile.name":1,"roles":1}}],"defaultNewUserRoles":["student"],"profileFilters":["school","classId"],"visibleUserFields":{"emails":1}}],"profileFilters":["school"]},{"name":"footballCoach","subordinates":[{"name":"footballCaptain","subordinates":[{"name":"footballPlayer"}]}]}],"defaultNewUserRoles":["teacher"]}],"defaultNewUserRoles":["teacher"]}}}

/***/ })
/******/ ]);
});
//# sourceMappingURL=test.js.map