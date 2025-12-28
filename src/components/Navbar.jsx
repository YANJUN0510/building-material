import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  // 使用 ref 来追踪状态，避免闭包陷阱，同时减少不必要的重渲染
  const [renderState, setRenderState] = useState({
    isFixed: false,
    isHidden: false
  });
  
  const lastScrollY = useRef(0);
  // 用 ref 记录上一次的渲染状态，方便逻辑判断
  const currentState = useRef({
    isFixed: false,
    isHidden: false
  });

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const threshold = 250;
      const isDown = currentScrollY > lastScrollY.current;
      
      let nextIsFixed = currentState.current.isFixed;
      let nextIsHidden = currentState.current.isHidden;

      if (currentScrollY > threshold) {
        // --- 超过阈值区域 ---
        if (isDown) {
          // 向下滚动
          if (currentState.current.isFixed) {
            // 如果已经是 fixed 状态，则隐藏它 (slide up)
            nextIsHidden = true;
          } else {
            // 关键点：如果之前是 absolute (非 fixed)，说明是刚从顶部滚下来
            // 此时保持 absolute，让它自然卷走，不要变 fixed，也不要变 hidden
            // 这样就消除了“闪现后消失”的问题
            nextIsFixed = false;
            nextIsHidden = false;
          }
        } else {
          // 向上滚动
          // 只要在阈值下方向上滚动，就必须是 fixed 且显示
          nextIsFixed = true;
          nextIsHidden = false;
        }
      } else {
        // --- 顶部区域 (< 250px) ---
        // 恢复 absolute，重置状态
        nextIsFixed = false;
        nextIsHidden = false;
      }

      // 只有状态真正改变时才更新 State 触发重渲染
      if (
        nextIsFixed !== currentState.current.isFixed || 
        nextIsHidden !== currentState.current.isHidden
      ) {
        currentState.current = { isFixed: nextIsFixed, isHidden: nextIsHidden };
        setRenderState({ isFixed: nextIsFixed, isHidden: nextIsHidden });
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const { isFixed, isHidden } = renderState;

  return (
    <nav className={`navbar ${isFixed ? 'fixed' : 'absolute'} ${isHidden ? 'hidden' : ''}`}>
      <Link to="/" className="logo">Building Material Warehouse</Link>
      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/philosophy">Philosophy</Link>
        <Link to="/collections">Collections</Link>
        <Link to="/#showcase">Projects</Link>
        <Link to="/#contact">Contact</Link>
      </div>
    </nav>
  );
};

export default Navbar;
