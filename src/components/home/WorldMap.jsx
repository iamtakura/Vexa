// src/components/home/WorldMap.jsx

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useVexaStore } from '../../store/useVexaStore';
import { WORLD_METADATA } from '../../data/worlds';
import WorldNode from '../map/WorldNode';

export default function WorldMap() {
  const navigate = useNavigate();
  const { sexEdSource, completedWorlds } = useVexaStore();

  // 1. Arrange worlds based on sexEdSource
  let mapWorlds = [...WORLD_METADATA];
  const isPornSource = sexEdSource === 'porn';
  if (isPornSource) {
    const world3 = mapWorlds.find((w) => w.id === 'world-3');
    const otherWorlds = mapWorlds.filter((w) => w.id !== 'world-3');
    mapWorlds = [otherWorlds[0], world3, ...otherWorlds.slice(1)];
  }

  // 2. Determine unlocking logic sequentially
  const isWorldUnlocked = (worldId, index) => {
    if (worldId === 'world-1') return true;
    if (worldId === 'world-3' && isPornSource) return true;
    
    if (index === 0) return true;
    const prevWorld = mapWorlds[index - 1];
    return completedWorlds.includes(prevWorld.id);
  };

  // 3. Compute status mapping
  let firstActiveFound = false;
  const worldStatuses = mapWorlds.map((world, idx) => {
    const completed = completedWorlds.includes(world.id);
    const unlocked = isWorldUnlocked(world.id, idx);
    
    let active = false;
    if (unlocked && !completed && !firstActiveFound) {
      active = true;
      firstActiveFound = true;
    }

    return {
      world,
      status: {
        completed,
        unlocked,
        active,
        locked: !unlocked
      }
    };
  });

  // 4. Generate visual snaking coordinates (x: percentage 0-100, y: pixels)
  const verticalSpacing = 100; // vertical gap in px
  const baseOffset = 24; // top padding
  const points = worldStatuses.map((_, idx) => {
    const x = idx % 2 === 0 ? 30 : 70; // 30% and 70% width
    const y = baseOffset + idx * verticalSpacing + 40; // 40px = node radius center
    return { x, y };
  });

  const handleNodeClick = (worldId) => {
    const num = worldId.split('-')[1];
    const firstLessonId = `w${num}-l1`;
    navigate(`/lesson/${worldId}/${firstLessonId}`);
  };

  const mapHeight = baseOffset + mapWorlds.length * verticalSpacing + 20;

  return (
    <div 
      className="relative w-full px-4 pb-8 select-none overflow-x-hidden min-h-0"
      style={{ height: `${mapHeight}px` }}
    >
      {/* SVG Connecting Paths Background */}
      <svg 
        className="absolute top-0 left-0 w-full pointer-events-none" 
        style={{ 
          height: `${mapHeight}px`,
          overflow: 'visible',
          width: '100%'
        }}
        viewBox={`0 0 100 ${mapHeight}`}
        preserveAspectRatio="none"
      >
        {points.map((p, idx) => {
          if (idx === 0) return null;
          const p0 = points[idx - 1];
          const p1 = p;
          
          // Smooth cubic bezier snake curve
          const cy = (p0.y + p1.y) / 2;
          const pathD = `M ${p0.x} ${p0.y} C ${p0.x} ${cy}, ${p1.x} ${cy}, ${p1.x} ${p1.y}`;
          
          // Path is completed if the previous node is completed
          const isCompletedPath = worldStatuses[idx - 1].status.completed;

          return (
            <path
              key={idx}
              d={pathD}
              fill="none"
              stroke={isCompletedPath ? 'rgba(255,107,71,0.5)' : 'rgba(255,255,255,0.12)'}
              strokeWidth="3"
              strokeDasharray="6 5"
              className="transition-all duration-500"
            />
          );
        })}
      </svg>

      {/* Render World Nodes */}
      {worldStatuses.map(({ world, status }, idx) => {
        const isWorld3Recommended = isPornSource && world.id === 'world-3';
        const p = points[idx];

        return (
          <div 
            key={world.id} 
            className={`absolute -translate-x-1/2 -translate-y-1/2 z-10 ${
              idx % 2 === 0 ? 'left-[30%]' : 'left-[70%]'
            }`}
            style={{ top: `${p.y}px` }}
          >
            <WorldNode
              world={world}
              status={status}
              isRecommended={isWorld3Recommended}
              onClick={() => handleNodeClick(world.id)}
            />
          </div>
        );
      })}
    </div>
  );
}
