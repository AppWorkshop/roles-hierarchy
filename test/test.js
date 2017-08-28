
const assert = require('assert');
const config = require('config');
import RoleHierarchy from '..';

describe('RoleHierarchy', function () {
  let roleHierarchy;

  it('get a new RoleHierarchy', function (done) {
    roleHierarchy = new RoleHierarchy(
      {
        "hierarchy": config.get("rolesHierarchyConfig.rolesHierarchy"),
        "loggingConfig": config.get("rolesHierarchyConfig.loggingConfig"),
        "treeModelConfig": config.get("rolesHierarchyConfig.treeModelConfig")
      }
    );
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
      organizations: ['springfield school', 'springfield football team'],
      school: 7
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

  it('getAllUserSubordinatesAsMap', function (done) {
    let subordinatesMap = roleHierarchy.getAllUserSubordinatesAsMap(myUserObj)
    assert.ok(subordinatesMap, 'Expected to get a subordinatesMap from schoolAdmin and footballCoach');
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

  it('isUserHasMoreSeniorRole', function (done) {
    let result = roleHierarchy.isUserHasMoreSeniorRole(myUserObj,"student", "springfield school")
    assert.ok(result, 'Expected to true');
    done();
  });

  it('isUserDescendantOfUser', function (done) {
    let result = roleHierarchy.isUserDescendantOfUser(myUserObj, myStudentObj, "springfield school");
    assert.ok(result, 'Expected true');
    result = roleHierarchy.isUserDescendantOfUser(myStudentObj,myUserObj, "springfield school"); // should be false
    assert.equal(result, false, 'Expected false');
    done();
  });

  it('getProfileCriteriaFromUser', function (done) {
    let result = roleHierarchy.getProfileCriteriaFromUser(myUserObj, {}, "springfield school");
    assert.deepEqual(result, {"profile.school": 7});
    done();
  });


});

