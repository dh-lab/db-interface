import {
  defineStandardProperties,
  defineMultilingualProperties
} from '../utils';
import BaseModel from './base';

/**
 * Class representing route
 */
export default class Routes extends BaseModel {
  /**
   * Route constructor
   * @param {Route} routeData
   */
  constructor(routeData) {
    super(routeData);

    defineMultilingualProperties(this, this.data, [
      'name',
      'description'
    ]);

    defineStandardProperties(this, this.data, [
      'photoLink',
      {
        name: 'locationIds',
        default: []
      }
    ]);
  }

  /**
   * Return entity name
   * @return {String}
   */
  static get entityType() {
    return 'routes';
  }

  /**
   * Return entity fields
   * @return {Array}
   */
  static get fields() {
    return ['name', 'description'];
  }

  /**
   * Delete location from list
   * @param {string} locationId - location to delete
   */
  deleteLocation(locationId) {
    const index = this.data.locationIds.findIndex(_locationId => locationId === _locationId);

    this.data.locationIds.splice(index, 1);
  }

  /**
   * Inserts new location to the end of list
   */
  insertNewLocation() {
    this.data.locationIds.push(null);
  }
}
