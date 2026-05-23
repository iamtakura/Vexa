// src/components/home/WorldMap.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVexaStore } from '../../store/useVexaStore';
import { WORLD_METADATA } from '../../data/worlds';
import WorldNode from '../map/WorldNode';

export default function WorldMap() {
  const navigate = useNavigate();
  const { sexEdSource, completedWorlds } = useVexaStore();

  const [viewportWidth, setViewportWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setViewportWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isTablet = viewportWidth >= 480 && viewportWidth < 1024;
  const mapWidth = isTablet ? 480 : 390;
  const mapCenter = mapWidth / 2;
  const xOffset = isTablet ? 72 : 42;

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

  // 4. Generate visual snaking coordinates for SVG lines
  const verticalSpacing = 100; // vertical gap in px (reduced from 120 to bring nodes closer)
  const baseOffset = 24; // top padding
  const points = worldStatuses.map((_, idx) => {
    const x = mapCenter + (idx % 2 === 0 ? -xOffset : xOffset);
    const y = baseOffset + idx * verticalSpacing + 40; // 40px = node radius center
    return { x, y };
  });

  const handleNodeClick = (worldId) => {
    // Navigate to the first lesson of that world
    const num = worldId.split('-')[1];
    const firstLessonId = `w${num}-l1`;
    navigate(`/lesson/${worldId}/${firstLessonId}`);
  };

  const mapHeight = baseOffset + mapWorlds.length * verticalSpacing + 20;

  return (
    <div className="relative w-full px-4 pb-8 select-none flex flex-col items-center min-h-0">
      {/* SVG Connecting Paths Background */}
      <svg 
        className="absolute top-0 left-0 w-full pointer-events-none" 
        style={{ 
          height: `${mapHeight}px`,
          overflow: 'visible',
          position: 'absolute',
          width: '100%'
        }}
        viewBox={`0 0 ${mapWidth} ${mapHeight}`}
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
      <div className="relative flex flex-col items-center w-full z-10 pt-[24px]">
        {worldStatuses.map(({ world, status }, idx) => {
          const isWorld3Recommended = isPornSource && world.id === 'world-3';
          const xShift = idx % 2 === 0 ? (isTablet ? 'translate-x-[-72px]' : 'translate-x-[-42px]') : (isTablet ? 'translate-x-[72px]' : 'translate-x-[42px]');

          return (
            <div 
              key={world.id} 
              className={`transform ${xShift} transition-transform duration-300`}
              style={{ height: `${verticalSpacing}px` }}
            >
              <WorldNode
                world={world}
                status={status}
                isRecommended={isWorld3Recommended}
                isTablet={isTablet}
                onClick={() => handleNodeClick(world.id)}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
