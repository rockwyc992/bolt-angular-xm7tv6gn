import { Injectable } from '@angular/core';
import { KillerCage } from './killer-cage.model';

@Injectable({
  providedIn: 'root'
})
export class SudokuService {
  private killerCages: KillerCage[] = [
    {
      cells: [
        { row: 0, col: 0 },
        { row: 0, col: 1 }
      ],
      sum: 7
    },
    {
      cells: [
        { row: 0, col: 2 },
        { row: 1, col: 2 }
      ],
      sum: 9
    },
    // 添加更多殺手框...
  ];

  // ... 保留原有方法 ...

  getKillerCages(): KillerCage[] {
    return this.killerCages;
  }

  validateKillerCage(board: number[][], cage: KillerCage): boolean {
    const sum = cage.cells.reduce((acc, cell) => {
      return acc + (board[cell.row][cell.col] || 0);
    }, 0);
    
    // 檢查框內數字是否重複
    const numbers = cage.cells
      .map(cell => board[cell.row][cell.col])
      .filter(n => n !== 0);
    const uniqueNumbers = new Set(numbers);
    
    return sum <= cage.sum && numbers.length === uniqueNumbers.size;
  }
}