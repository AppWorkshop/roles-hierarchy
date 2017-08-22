Role Hierarchy Data Model
===

This is a data model for a hierarchy of roles, suitable for mongodb users or meteor.

Given a definition of a role hierarchy :

```json
{
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
let subordinatesMap = roleHierarchy.getAllUserSubordinatesAsArray(myUserObj);
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