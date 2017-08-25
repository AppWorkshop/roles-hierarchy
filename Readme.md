Role Hierarchy Data Model
===

[![Build Status](https://travis-ci.org/AppWorkshop/roles-hierarchy.svg?branch=master)](https://travis-ci.org/AppWorkshop/roles-hierarchy)

This is a data model for a hierarchy of roles, suitable for mongodb users or meteor.

Given a definition of a role hierarchy :

```js
  let hierarchyObj = {
      "name": "admin",
      "subordinates": [
        {
          "name": "user-admin",
          "subordinates": [
            {
              "name": "schoolAdmin",
              "subordinates": [
                {
                  "name": "teacher",
                  "subordinates": [
                    {
                      "name": "student",
                      // a student can see the following fields
                      "visibleUserFields": {
                        "_id": 1,
                        "username": 1,
                        "profile.name": 1,
                        "roles": 1
                      }
                    }
                  ],
                  // new users created by a teacher get the student role
                  "defaultNewUserRoles": [
                    "student"
                  ],
                  // new users created by a teacher get the teacher's profile.school and profile.classId
                  "profileFilters": [
                    "school",
                    "classId"
                  ],
                  // a teacher can see everything a student can see, also email addresses
                  "visibleUserFields": {
                    "emails": 1
                  }
                }
              ],
              "profileFilters": [
                "school"
              ]
            },
            {
              "name":"footballCoach",
              "subordinates":[
                {
                  "name": "footballCaptain",
                  "subordinates" :[
                    {
                      "name":"footballPlayer"
                    }
                  ]
                }
              ]
            }
          ],
          "defaultNewUserRoles": [
            "teacher"
          ]
        }
      ],
      "defaultNewUserRoles": [
        "teacher"
      ]
    }

    let roleHierarchy = new RoleHierarchy(
      {
        "rolesHierarchy": hierarchyObj),
        "loggingConfig": { level: "debug" },
        treeModelConfig: { "childrenPropertyName": "subordinates" },
      }      
    );
```


And a user :

```js
  let myUserObj = {
    _id: 'abc123',
    profile: {
      organizations: ['springfield school', 'springfield football team']
    },
    "roles": {
      "springfield school": [
        "schoolAdmin",
        "footballCaptain"
      ],
      "springfield football team": [
        "footballCoach"
      ]

    }
  };
```

You can find information about the user's subordinates. 

```js
let subordinatesMap = roleHierarchy.getAllUserSubordinatesAsMap(myUserObj);
/*
{
        "springfield school": ["teacher", "student", "footballPlayer"],
        "springfield football team": ["footballCaptain", "footballPlayer"]
      }
*/
```

Or about a role's subordinates 

```js
let subordinatesArray = roleHierarchy.getAllSubordinateRolesAsArray('schoolAdmin');
/*
["teacher", "student"]
*/
```

## Tests

Look in the test/test.js file, it gives you a pretty good idea of how to use this library.

To run the tests, simply :

```npm test```

## API

docs generated with jsdoc2md

<a name="RoleHierarchy"></a>

## RoleHierarchy
**Kind**: global class

* [RoleHierarchy](#RoleHierarchy)
    * [new RoleHierarchy(paramsObj)](#new_RoleHierarchy_new)
    * _instance_
        * [.reparse(rolesHierarchy)](#RoleHierarchy+reparse)
        * [._getOrganizationsForUser(myUserObj)](#RoleHierarchy+_getOrganizationsForUser) ⇒ <code>Array.&lt;String&gt;</code>
        * [.findRoleInHierarchy(roleName)](#RoleHierarchy+findRoleInHierarchy) ⇒ <code>object</code>
        * [.getRoleSubordinate(seniorRoleName, subordinateRoleName)](#RoleHierarchy+getRoleSubordinate) ⇒ <code>object</code>
        * [.getAllSubordinateRolesAsArray(seniorRoleName)](#RoleHierarchy+getAllSubordinateRolesAsArray) ⇒ <code>Array</code>
        * [.getAllUserSubordinatesAsMap(myUserObj)](#RoleHierarchy+getAllUserSubordinatesAsMap) ⇒ <code>Object</code>
        * [.getAllMyFieldsAsObject(myUserObj)](#RoleHierarchy+getAllMyFieldsAsObject) ⇒ <code>object</code>
        * [.isUserHasMoreSeniorRole(myUserObj, roleName, organizationName)](#RoleHierarchy+isUserHasMoreSeniorRole) ⇒ <code>boolean</code>
        * [.isUserDescendantOfUser(seniorUserObj, subordinateUserObj, organizationName)](#RoleHierarchy+isUserDescendantOfUser) ⇒ <code>boolean</code>
        * [.getProfileCriteriaFromUser(userWithProfile, profileFilterCriteria, organizationName)](#RoleHierarchy+getProfileCriteriaFromUser) ⇒ <code>object</code>
    * _static_
        * [._getRolesForUser(user, group)](#RoleHierarchy._getRolesForUser) ⇒ <code>Array</code>

<a name="new_RoleHierarchy_new"></a>

### new RoleHierarchy(paramsObj)
create a new instance of RoleHierarchy


| Param | Type | Description |
| --- | --- | --- |
| paramsObj | <code>Object</code> | containing a hierarchy and a loggingConfig (optional) and a TreeModel config (optional): {   hierarchy: {"name":"teacher", "subordinates": [ {"name":"student"} ]},   treeModelConfig: { "childrenPropertyName": "subordinates" },   loggingConfig: { "level": "debug"}} |

<a name="RoleHierarchy+reparse"></a>

### roleHierarchy.reparse(rolesHierarchy)
re-create the hierarchy with a new object structure.

**Kind**: instance method of [<code>RoleHierarchy</code>](#RoleHierarchy)

| Param | Type |
| --- | --- |
| rolesHierarchy | <code>Object</code> |

<a name="RoleHierarchy+_getOrganizationsForUser"></a>

### roleHierarchy._getOrganizationsForUser(myUserObj) ⇒ <code>Array.&lt;String&gt;</code>
Get the organizations that the user belongs to, as an array.

**Kind**: instance method of [<code>RoleHierarchy</code>](#RoleHierarchy)
**Returns**: <code>Array.&lt;String&gt;</code> - an array of the organizations that the user belongs to.

| Param | Type | Description |
| --- | --- | --- |
| myUserObj | <code>Object</code> | an object containing an organization or organizations property. |

<a name="RoleHierarchy+findRoleInHierarchy"></a>

### roleHierarchy.findRoleInHierarchy(roleName) ⇒ <code>object</code>
Find a role in the hierarchy by name

**Kind**: instance method of [<code>RoleHierarchy</code>](#RoleHierarchy)
**Returns**: <code>object</code> - - the node in the tree that matches

| Param | Type | Description |
| --- | --- | --- |
| roleName | <code>string</code> | the name of the role to find |

<a name="RoleHierarchy+getRoleSubordinate"></a>

### roleHierarchy.getRoleSubordinate(seniorRoleName, subordinateRoleName) ⇒ <code>object</code>
Return the subordinate roles of the given seniorRoleName

**Kind**: instance method of [<code>RoleHierarchy</code>](#RoleHierarchy)
**Returns**: <code>object</code> - - the role of the subordinate, or false if not found.

| Param | Type | Description |
| --- | --- | --- |
| seniorRoleName | <code>string</code> | the name of the senior role |
| subordinateRoleName | <code>string</code> | the name of the subordinate role |

<a name="RoleHierarchy+getAllSubordinateRolesAsArray"></a>

### roleHierarchy.getAllSubordinateRolesAsArray(seniorRoleName) ⇒ <code>Array</code>
Get the names of subordinate roles as an array

**Kind**: instance method of [<code>RoleHierarchy</code>](#RoleHierarchy)
**Returns**: <code>Array</code> - - the subordinate role names if any, otherwise undefined.

| Param | Type | Description |
| --- | --- | --- |
| seniorRoleName | <code>string</code> | the name of the senior role |

<a name="RoleHierarchy+getAllUserSubordinatesAsMap"></a>

### roleHierarchy.getAllUserSubordinatesAsMap(myUserObj) ⇒ <code>Object</code>
Get a map of all of the role names that the provided user can administer, grouped by organization

**Kind**: instance method of [<code>RoleHierarchy</code>](#RoleHierarchy)
**Returns**: <code>Object</code> - an object of subordinate {organization:[roleName, roleName]} arrays that the provided user can administer

| Param | Description |
| --- | --- |
| myUserObj | the user object of the provided user, with a roles property and a profile.organization or profile.organizations |

<a name="RoleHierarchy+getAllMyFieldsAsObject"></a>

### roleHierarchy.getAllMyFieldsAsObject(myUserObj) ⇒ <code>object</code>
Get an object of all of the Meteor.user fields that the provided user can see

**Kind**: instance method of [<code>RoleHierarchy</code>](#RoleHierarchy)
**Returns**: <code>object</code> - an object of the format {orgName: [{field1: 1, field2: 2}]}, the values being Meteor.user field names that the provided user can see, suitable for inclusion
as a "fields" property in a mongodb Collection query.

| Param | Description |
| --- | --- |
| myUserObj | the user object of the provided user, with a roles property |

<a name="RoleHierarchy+isUserHasMoreSeniorRole"></a>

### roleHierarchy.isUserHasMoreSeniorRole(myUserObj, roleName, organizationName) ⇒ <code>boolean</code>
returns true if the given object is more senior than the given role in the given organization.

**Kind**: instance method of [<code>RoleHierarchy</code>](#RoleHierarchy)
**Returns**: <code>boolean</code> - true if the user is more senior than the given role

| Param | Description |
| --- | --- |
| myUserObj | the user object of the provided user, with a roles property and an organization(s) property |
| roleName | the name of the role to query |
| organizationName | the name of the organization to query whether the user has the role |

<a name="RoleHierarchy+isUserDescendantOfUser"></a>

### roleHierarchy.isUserDescendantOfUser(seniorUserObj, subordinateUserObj, organizationName) ⇒ <code>boolean</code>
returns true if the given senior user is higher in the hierarchy than the given subordinate user for the given organization.

**Kind**: instance method of [<code>RoleHierarchy</code>](#RoleHierarchy)
**Returns**: <code>boolean</code> - true if the subordinateUser is below seniorUser in the hierarchy for at least one organization in common.

| Param | Description |
| --- | --- |
| seniorUserObj | the senior user we're checking, with roles property and organization(s) property |
| subordinateUserObj | the user we want to check see if they are subordinate to the senior user, with roles property and organization(s) property |
| organizationName | the name of the organization whose roles to check |

<a name="RoleHierarchy+getProfileCriteriaFromUser"></a>

### roleHierarchy.getProfileCriteriaFromUser(userWithProfile, profileFilterCriteria, organizationName) ⇒ <code>object</code>
Copy the given user's profile properties (as specified in roles hierarchy as profileFilters) as profile properties suitable for adding to a new user.

**Kind**: instance method of [<code>RoleHierarchy</code>](#RoleHierarchy)
**Returns**: <code>object</code> - the query criteria, suitable for mongodb, to ensure only users with the same values for the specified fields will be returned.

| Param | Type | Description |
| --- | --- | --- |
| userWithProfile | <code>object</code> | the user object, with a profile property to copy |
| profileFilterCriteria | <code>object</code> | existing profileFilterCriteria. Note that if any properties are already specified, they may  get overwritten. |
| organizationName | <code>string</code> | the organization we're dealing with. |

<a name="RoleHierarchy._getRolesForUser"></a>

### RoleHierarchy._getRolesForUser(user, group) ⇒ <code>Array</code>
Retrieve users roles

**Kind**: static method of [<code>RoleHierarchy</code>](#RoleHierarchy)
**Returns**: <code>Array</code> - Array of user's roles, unsorted.

| Param | Type | Description |
| --- | --- | --- |
| user | <code>Object</code> | user object |
| group | <code>String</code> | Optional name of group to restrict roles to.                         User's _GLOBAL_GROUP will also be included. |
