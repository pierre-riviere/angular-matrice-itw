import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  public nbCols: number;
  public nbRows: number;
  public matrix: Array<Array<string>>;

  private rowColors: string[];
  private timer: any;
  /**
   * Used for timer, in milliseconds
   */
  private timeoutDuration = 1000;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.getDimensions();
  }

  ngOnDestroy() {
    this.destroyTimer();
  }

  /**
   * Get rows and cols params from url
   */
  private getDimensions() {
    this.route.queryParams.subscribe((params) => {
      let { nbCols, nbRows } = params;
      nbCols = +nbCols;
      nbRows = +nbRows;
      if (!isNaN(nbCols) && !isNaN(nbRows)) {
        this.nbCols = nbCols;
        this.nbRows = nbRows;
        this.initMatrix();
      }
    });
  }

  /**
   * Init matrix
   *
   * @returns {void} - return void
   */
  private initMatrix(): void {
    if (!this.nbCols || !this.nbRows) {
      return;
    }

    this.rowColors = [];
    this.matrix = new Array(this.nbRows);

    this.setMatrix(null);

    this.handleBox();
  }

  /**
   * Display a random box by setting a CSS class
   */
  private handleBox() {
    this.timer = setTimeout(() => {
      const row = this.getRandomInteger(this.nbRows);
      const col = this.getRandomInteger(this.nbCols);
      this.matrix[row][col] = 'blink';

      const hasAllDisplayedBox = this.matrix.every((r) => r.every((c) => c));

      if (hasAllDisplayedBox) {
        this.destroyTimer();
        this.setMatrix('visible');
      } else {
        this.handleBox();
      }
    }, this.timeoutDuration);
  }

  /**
   * Set specified CSS class to all matrix boxes
   *
   * @param {string} value - class
   */
  private setMatrix(value: string) {
    for (let row = 0; row < this.nbRows; row++) {
      this.matrix[row] = new Array(this.nbCols).fill(value);
    }
  }

  /**
   * Destroy timer
   */
  private destroyTimer() {
    clearTimeout(this.timer);
  }

  /**
   * Returns random integer
   *
   * @param {number} max - max integer
   * @returns {number}
   */
  private getRandomInteger(max: number): number {
    return Math.floor(Math.random() * Math.floor(max));
  }

  /**
   * Get a new hexa color
   *
   * @returns {string}
   */
  private get newColor(): string {
    let color: string;

    do {
      color = this.getRandomColor();
    } while (this.rowColors.includes(color));

    this.rowColors.push(color);

    return color;
  }

  /**
   * Generate and return a random hexa color
   *
   * @returns {string}
   */
  private getRandomColor(): string {
    return '#' + (Math.random() * 0xfffff * 1000000).toString(16).slice(0, 6);
  }

  /**
   * Get current class of the box identified by his position (row and col index)
   *
   * @param {number} rowIndex
   * @param {number} colIndex
   * @returns {string}
   */
  public getBoxClass(rowIndex: number, colIndex: number): string {
    return this.matrix[rowIndex][colIndex] || 'hidden';
  }

  /**
   * Get hexa color by row index
   *
   * @param {number} index - row index
   * @returns {string}
   */
  public getColorByRowIndex(index: number): string {
    if (index < 0) {
      return '';
    }

    if (this.rowColors.length > index) {
      return this.rowColors[index];
    }

    return this.newColor;
  }

  /**
   * Return TRUE if nbRows and nbCols are defined
   * otherwise return FALSE
   *
   * @returns {boolean}
   */
  public hasDimensions(): boolean {
    return Boolean(this.nbRows && this.nbCols);
  }
}
