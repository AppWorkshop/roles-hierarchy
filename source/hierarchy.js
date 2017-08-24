const winston = require('winston');
process.env.SUPPRESS_NO_CONFIG_WARNING = 'y';
const TreeModel = require('tree-model');
const topiary = require('topiary');
const _ = require('underscore');

class Hierarchy {

  /**
   * create a new instance of Hierarchy
   * @param {Object} paramsObj containing a Hierarchy and a loggingConfig (optional) and a TreeModel config (optional):
   * {
   *   hierarchy: {"name":"teacher", "subordinates": [ {"name":"student"} ]},
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
    this.root = this.treeModel.parse(paramsObj.hierarchy);
    this.logger.debug(this.getTopiaryAsString(this.root.model));
  }

  /**
   * re-create the hierarchy with a new object structure.
   * @param {Object} hierarchy 
   */
  reparse(hierarchy) {
    this.root = this.treeModel.parse(hierarchy);
  }

  _findNode(nodeName, startNode = this.root) {
    return startNode.first({ strategy: 'breadth' }, function (node) {
      return node.model.name === nodeName;
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
   * Find a node in the hierarchy by name
   * @param {string} nodeName - the name of the node to find (i.e. 'name' property value)
   * @returns {*} - the node in the tree that matches
   */
  findNodeInHierarchy(nodeName, startNode) {
    let result = this._findNode(nodeName, startNode);
    if (result && result.model) {
      this.logger.debug(`findNodeInHierarchy(${nodeName}) => returning ${JSON.stringify(result.model, null, 2)}`);
      return result.model;
    }
    this.logger.debug(`findNodeInHierarchy(${nodeName}) => returning undefined`);

  }

  /**
   * Return the descendent node of the given nodeName if found.
   * @param {string} nodeName - the name of the node underneath which we should search
   * @param {string} descendantNodeName - the name of the descendant node to find
   * @returns {object} - the node of the descendant, or undefined or false if not found.
   */
  findDescendantNodeByName(nodeName, descendantNodeName, startNode) {
    // get the node for the node name
    let senior = this._findNode(nodeName, startNode);
    if (!senior) {
      return false;
    }
    let junior = this._findNode(descendantNodeName, senior);
    if (junior) {
      this.logger.debug(`findDescendantNodeByName(${nodeName},${descendantNodeName}) => returning ${JSON.stringify(junior.model, null, 2)}`);
      return junior.model;
    } else {
      this.logger.debug(`findDescendantNodeByName(${nodeName}) => returning undefined`);
    }
  }

  /**
   * Get the names of subordinate nodes as an array
   * @param {string} nodeName - the name of the senior node i.e. 'name' property value
   * @returns {Array} - the subordinate node names if any, otherwise undefined.
   */
  getAllDescendantNodesAsArray(nodeName, startNode) {
    // find the node for the given node name
    let seniorNode = this._findNode(nodeName, startNode);
    // get all the nodes under this one
    let result = seniorNode.all({ strategy: 'breadth' }, function (node) {
      return node.model.name !== nodeName;
    }).map((item) => { // get the names of each node
      return item.model.name;
    });
    this.logger.debug(`getAllDescendantNodesAsArray(${nodeName}) => returning ${JSON.stringify(result, null, 2)}`);
    return result;
  }

  getTopiaryAsString(hierarchy = this.root) {
    return topiary(hierarchy, 'subordinates');
  }
}

module.exports = Hierarchy;