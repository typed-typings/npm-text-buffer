import Marker = require('./marker');
import Point = require('./point');
import EventKit = require('event-kit');

declare class MarkerLayer {
  // Lifecycle
  copy(): void;
  destroy(): void;
  isDestroyed(): boolean;
  // Querying
  getMarker(): Marker;
  getMarkers(): Marker[];
  getMarkerCount(): number;
  /**
   * @params params A hash of key-value pairs constraining the set of returned markers.
   * You can query against custom marker properties by listing the desired key-value pairs here.
   * In addition, the following keys are reserved and have special semantics:
   *    startPosition	Only include markers that start at the given Point.
   *    endPosition Only include markers that end at the given Point.
   *    containsPoint Only include markers that contain the given Point, inclusive.
   *    containsRange	Only include markers that contain the given Range, inclusive.
   *    startRow Only include markers that start at the given row Number.
   *    endRow Only include markers that end at the given row Number.
   *    intersectsRow Only include markers that intersect the given row Number.
   */
  findMarkers(params: {
    startPosition?: Point,
    endPosition?: Point,
    containsPoint?: Point,
    containsRange?: Range,
    startRow?: number,
    endRow?: number;
    intersectsRow?: number
  }): Marker[];
  // Marker creation
  markRange(range: Range | Point[], properties: {
    reversed?: boolean,
    persistent?: boolean,
    invalidate?: 'never' | 'surround' | 'overlap' | 'inside' | 'touch'
  }): Marker;
  markPosition(position: Point | number[], properties: {
    reversed?: boolean,
    persistent?: boolean,
    invalidate?: 'never' | 'surround' | 'overlap' | 'inside' | 'touch'
  }): Marker;
  // Event subscription

  onDidUpdate: EventKit.EventHandler;
  onDidCreateMarker: EventKit.EventHandler;
  onDidDestroy(): EventKit.Disposable;
}

export = MarkerLayer;
