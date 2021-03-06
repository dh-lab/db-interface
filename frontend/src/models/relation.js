import {
  defineStandardProperties,
  defineMultilingualProperties
} from '../utils';
import BaseModel from './base';
import PersonModel from './person';
import LocationModel from './location';
import RelationTypeModel from './relationType';

/**
 * Class representing person
 */
export default class Relation extends BaseModel {
  /**
   * Person constructor
   * @param {Person} _relationData
   */
  constructor(_relationData) {
    super(_relationData);

    if (typeof this.data.personId !== 'string') {
      this.person = new PersonModel(this.data.personId);
    }

    if (typeof this.data.locationId !== 'string') {
      this.location = new LocationModel(this.data.locationId);
    }

    if (typeof this.data.relationId !== 'string') {
      this.relation = new RelationTypeModel(this.data.relationId);
    }

    defineMultilingualProperties(this, this.data, [
      'quote'
    ]);

    defineStandardProperties(this, this.data, [
      {
        name: 'personId',
        default: null
      },
      {
        name: 'locationId',
        default: null
      },
      {
        name: 'relationId',
        default: null
      }
    ]);
  }

  /**
   * Return entity name
   * @return {String}
   */
  static get entityType() {
    return 'relations';
  }

  /**
   * Return entity fields
   * @return {Array}
   */
  static get fields() {
    return ['personName', 'relationName', 'locationName'];
  }

  /**
   * Person name to display
   * @returns {string}
   */
  get personName() {
    return this.person && this.person.searchName;
  }

  /**
   * Location name to display
   * @returns {string}
   */
  get locationName() {
    return this.location && this.location.searchName;
  }

  /**
   * Relation type name to display
   * @returns {string}
   */
  get relationName() {
    return this.relation && this.relation.name;
  }
}
