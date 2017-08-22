
const assert = require('assert');
const config = require('config');
import RoleHierarchy from '..';

describe('RoleHierarchy', function () {
  let roleHierarchy;

  it('get a new RoleHierarchy', function (done) {
    roleHierarchy = new RoleHierarchy(config.get("rolesHierarchyConfig"));
    assert.ok(roleHierarchy);
    done();
  });

  it('Find a role in the hierarchy', function (done) {
    let teacher = roleHierarchy.findRoleInHierarchy("teacher");
    assert.equal(teacher.name, "teacher", "Expected role name to be teacher");
    done();
  });

  it('getRoleSubordinate', function (done) {
    let subordinate = roleHierarchy.getRoleSubordinate('teacher', 'student');
    assert.ok(subordinate, 'Expected to get a subordinate from teacher');
    assert.equal(subordinate.name, 'student', 'Expected to get a student subordinate from teacher');
    done();
  });


  it('getAllSubordinateRolesAsArray', function (done) {
    let subordinatesArray = roleHierarchy.getAllSubordinateRolesAsArray('schoolAdmin');
    assert.ok(subordinatesArray, 'Expected to get a subordinatesArray from schoolAdmin');
    assert.deepEqual(subordinatesArray, ["teacher", "student"], "Expected ['teacher','student']");
    done();
  });

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

  let myStudentObj = {
    _id: 'abc123',
    profile: {
      organization: 'springfield school'
    },
    "roles": {
      "springfield school":
      [
        "student",
        "footballCaptain"
      ]
    }
  };

  it('getAllUserSubordinatesAsArray', function (done) {
    let subordinatesMap = roleHierarchy.getAllUserSubordinatesAsArray(myUserObj)
    assert.ok(subordinatesMap, 'Expected to get a subordinatesArray from schoolAdmin and footballCoach');
    assert.deepEqual(subordinatesMap,
      {
        "springfield school": ["teacher", "student", "footballPlayer"],
        "springfield football team": ["footballCaptain", "footballPlayer"]
      }
      , "Unexpected subordinate results");
    done();
  });

  it('getAllMyFieldsAsObjects', function (done) {
    let fieldsObj = roleHierarchy.getAllMyFieldsAsObject(myUserObj)
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

});

