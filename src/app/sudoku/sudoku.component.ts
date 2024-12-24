import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SudokuService } from './sudoku.service';
import { KillerCage } from './killer-cage.model';

@Component({
  selector: 'app-sudoku',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="sudoku-container">
      <h1>Killer Sudoku</h1>
      <div class="board">
        <div *ngFor="let row of board; let i = index" class="row">
          <div *ngFor="let cell of row; let j = index" 
               class="cell"
               [class.original]="originalBoard[i][j] !== 0"
               [class.invalid]="!isValid(i, j)"
               [class.selected]="selectedCell.row === i && selectedCell.col === j"
               [class.killer-cage]="isPartOfKillerCage(i, j)"
               (click)="selectCell(i, j)">
            <div *ngIf="getCageSum(i, j)" class="cage-sum">{{getCageSum(i, j)}}</div>
            <input *ngIf="originalBoard[i][j] === 0"
                   type="number"
                   min="1"
                   max="9"
                   [(ngModel)]="board[i][j]"
                   (input)="onInput($event, i, j)">
            <span *ngIf="originalBoard[i][j] !== 0">{{cell}}</span>
          </div>
        </div>
      </div>
      <div class="controls">
        <button (click)="newGame()">New Game</button>
        <button (click)="checkSolution()">Check Solution</button>
      </div>
    </div>
  `,
  styles: [`
    /* ... 保留原有樣式 ... */
    
    .killer-cage {
      border: 2px dashed #666;
    }

    .cage-sum {
      position: absolute;
      top: 2px;
      left: 2px;
      font-size: 12px;
      color: #666;
    }
  `]
})
export class SudokuComponent implements OnInit {
  // ... 保留原有屬性 ...
  killerCages: KillerCage[] = [];

  constructor(private sudokuService: SudokuService) {}

  ngOnInit() {
    this.newGame();
    this.killerCages = this.sudokuService.getKillerCages();
  }

  isPartOfKillerCage(row: number, col: number): boolean {
    return this.killerCages.some(cage => 
      cage.cells.some(cell => cell.row === row && cell.col === col)
    );
  }

  getCageSum(row: number, col: number): number | null {
    const cage = this.killerCages.find(cage => 
      cage.cells[0].row === row && cage.cells[0].col === col
    );
    return cage ? cage.sum : null;
  }

  checkSolution() {
    let isComplete = true;
    let isValid = true;
    let killerCagesValid = true;

    // 檢查基本數獨規則
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (this.board[i][j] === 0) {
          isComplete = false;
        } else if (!this.isValid(i, j)) {
          isValid = false;
        }
      }
    }

    // 檢查殺手框規則
    killerCagesValid = this.killerCages.every(cage => 
      this.sudokuService.validateKillerCage(this.board, cage)
    );

    if (!isComplete) {
      alert('請完成填寫所有空格！');
    } else if (!isValid) {
      alert('數字填寫有誤，請檢查！');
    } else if (!killerCagesValid) {
      alert('殺手框規則不符合，請檢查框內數字總和！');
    } else {
      alert('恭喜！你已成功解開謎題！');
    }
  }
}