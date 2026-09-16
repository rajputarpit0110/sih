import React from 'react';
import type { MineLocation } from '../../types/exploration';
import { formatTonnes } from '../../lib/utils';

interface MineSelectorProps {
  mines: MineLocation[];
  selectedMine: MineLocation | null;
  onSelectMine: (mine: MineLocation) => void;
}

export const MineSelector: React.FC<MineSelectorProps> = ({
  mines,
  selectedMine,
  onSelectMine,
}) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs">
        <span className="text-xs font-semibold text-slate-800">
          Select operating mine
        </span>
        <span className="text-xs text-slate-500 font-normal">
          10 MOIL assets active
        </span>
      </div>

      {/* Horizontal Compact Asset Bar */}
      <div
        role="radiogroup"
        aria-label="Select Operating Mine Asset"
        className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-2"
      >
        {mines.map((mine) => {
          const isSelected = selectedMine?.mine_id === mine.mine_id;
          return (
            <button
              key={mine.mine_id}
              type="button"
              role="radio"
              aria-checked={isSelected}
              aria-label={`${mine.mine_name} (${mine.mine_id}), Target: ${Math.round(mine.avg_target_tonnes / 1000)} thousand tonnes`}
              onClick={() => onSelectMine(mine)}
              className={`relative flex flex-col text-left px-3 py-2.5 rounded-lg border transition-all text-xs focus-visible:ring-2 focus-visible:ring-[#c26d3a] focus-visible:outline-none shadow-xs cursor-pointer ${
                isSelected
                  ? 'border-[#c26d3a] bg-gradient-to-b from-orange-50/90 to-white text-slate-900 ring-1 ring-[#c26d3a] shadow-sm -translate-y-0.5'
                  : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-900 hover:-translate-y-0.5'
              }`}
            >
              {isSelected && (
                <span className="absolute top-0 left-2 right-2 h-[2px] bg-[#c26d3a] rounded-full" />
              )}
              <span className="font-bold truncate text-xs leading-tight">
                {mine.mine_name}
              </span>
              <div className="flex items-center justify-between mt-2 text-[10px] sm:text-xs font-mono">
                <span className={isSelected ? 'text-[#c26d3a] font-bold' : 'text-slate-400'}>
                  {mine.mine_id}
                </span>
                <span className={`font-semibold ${isSelected ? 'text-slate-900' : 'text-slate-500'}`}>
                  {Math.round(mine.avg_target_tonnes / 1000)}k t
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
