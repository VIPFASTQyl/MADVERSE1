import React, { useEffect, useRef, useState } from 'react';
import './HeroSectionAnimated.css';

declare global {
  interface Window {
    lottie: any;
  }
}

const HeroSectionAnimated: React.FC = () => {
  const heroSectionRef = useRef<HTMLDivElement>(null);
  const infinityBlockRef = useRef<HTMLDivElement>(null);
  const rightBlockRef = useRef<HTMLDivElement>(null);
  const leftBlockRef = useRef<HTMLDivElement>(null);
  const leftIndicatorRef = useRef<HTMLDivElement>(null);
  const rightIndicatorRef = useRef<HTMLDivElement>(null);
  const loaderRef = useRef<HTMLDivElement>(null);

  const [isReady, setIsReady] = useState(false);

  const animationsRef = useRef({
    circles: null as any,
    bg: null as any,
    loopAnim: null as any,
  });

  const stateRef = useRef({
    isRight: false,
    isLeft: true,
    isCircleHalf: false,
    isBgHalf: false,
    isLoopHalf: false,
    timerIn: null as NodeJS.Timeout | null,
    timerOut: null as NodeJS.Timeout | null,
    totalFramesCircles: 0,
    totalFramesBg: 0,
    totalFramesLoop: 0,
  });

  useEffect(() => {
    // Detect browser
    const isFirefox = typeof (window as any).InstallTrigger !== 'undefined';
    const detectFFVersion = window.navigator.userAgent.match(/Firefox\/([0-9]+)\./);
    const targetVersion = detectFFVersion ? parseInt(detectFFVersion[1]) : 0;
    const isIE = (/*@cc_on!@*/ false) || !!(document as any).documentMode;
    const isEdge = !isIE && !!(window as any).StyleMedia;

    const infinityBlock = infinityBlockRef.current;
    const rightBlock = rightBlockRef.current;
    const leftBlock = leftBlockRef.current;
    const heroSection = heroSectionRef.current;

    if (isFirefox && infinityBlock) {
      if (targetVersion > 57) {
        infinityBlock.classList.add('ff');
      } else {
        infinityBlock.classList.add('ff-old');
      }
    }

    if (isIE && infinityBlock && leftBlock && rightBlock && heroSection) {
      infinityBlock.classList.add('ie');
      leftBlock.classList.add('ie');
      rightBlock.classList.add('ie');
      if (window.innerWidth < 1400) {
        heroSection.classList.add('laptop-ie');
      }
    }

    if (isEdge && infinityBlock && leftBlock && rightBlock) {
      infinityBlock.classList.add('edge');
      leftBlock.classList.add('edge');
      rightBlock.classList.add('edge');
    }

    // Detect touchable device
    const isTouchDevice = 'ontouchstart' in document.documentElement;

    // Load Lottie and animations
    if ((window as any).lottie) {
      const circlesContainer = document.getElementById('circles');
      const bgContainer = document.getElementById('animated-bg');
      const loopContainer = document.getElementById('loop');

      if (circlesContainer && bgContainer && loopContainer) {
        const circlesParams = {
          container: circlesContainer,
          renderer: 'svg',
          loop: false,
          autoplay: false,
          path: 'https://s3-us-west-1.amazonaws.com/zajno-storage0/rocket-source/circles.json',
        };

        const bgParams = {
          container: bgContainer,
          renderer: 'svg',
          loop: false,
          autoplay: false,
          path: 'https://s3-us-west-1.amazonaws.com/zajno-storage0/rocket-source/bg.json',
        };

        const loopParams = {
          container: loopContainer,
          renderer: 'svg',
          loop: false,
          autoplay: false,
          path: 'https://s3-us-west-1.amazonaws.com/zajno-storage0/rocket-source/loop.json',
        };

        const circles = (window as any).lottie.loadAnimation(circlesParams);
        const bg = (window as any).lottie.loadAnimation(bgParams);
        const loopAnim = (window as any).lottie.loadAnimation(loopParams);

        animationsRef.current.circles = circles;
        animationsRef.current.bg = bg;
        animationsRef.current.loopAnim = loopAnim;

        // Event listeners for animation load
        circles.addEventListener('DOMLoaded', function () {
          stateRef.current.totalFramesCircles = circles.totalFrames;
          if (loaderRef.current) {
            loaderRef.current.classList.remove('active');
          }
          if (heroSectionRef.current) {
            heroSectionRef.current.classList.add('active');
          }
        });

        bg.addEventListener('DOMLoaded', function () {
          stateRef.current.totalFramesBg = bg.totalFrames;
        });

        loopAnim.addEventListener('DOMLoaded', function () {
          stateRef.current.totalFramesLoop = loopAnim.totalFrames;
        });
      }
    }

    // Animation functions
    const playCircleAnimation = () => {
      const { totalFramesCircles, isCircleHalf } = stateRef.current;
      const circles = animationsRef.current.circles;

      if (!circles || totalFramesCircles === 0) return;

      if (!isCircleHalf) {
        circles.playSegments([0, totalFramesCircles / 2], true);
        stateRef.current.isCircleHalf = true;
      } else {
        circles.playSegments([totalFramesCircles / 2, totalFramesCircles], true);
        stateRef.current.isCircleHalf = false;
      }
    };

    const playBgAnimation = () => {
      const { totalFramesBg, isBgHalf } = stateRef.current;
      const bg = animationsRef.current.bg;

      if (!bg || totalFramesBg === 0) return;

      if (!isBgHalf) {
        bg.playSegments([0, totalFramesBg / 2], true);
        stateRef.current.isBgHalf = true;
      } else {
        bg.playSegments([totalFramesBg / 2, totalFramesBg], true);
        stateRef.current.isBgHalf = false;
      }
    };

    const playLoopAnimation = () => {
      const { totalFramesLoop } = stateRef.current;
      const loopAnim = animationsRef.current.loopAnim;

      if (!loopAnim || totalFramesLoop === 0) return;

      if (!stateRef.current.isLoopHalf) {
        loopAnim.playSegments([0, totalFramesLoop / 2], true);
        showRectangle();
        stateRef.current.isLoopHalf = true;
      } else {
        loopAnim.playSegments([totalFramesLoop / 2, totalFramesLoop], true);
        showRectangle();
        stateRef.current.isLoopHalf = false;
      }
    };

    const showRectangle = () => {
      const rectangle = document.getElementById('mask');
      if (rectangle) {
        if (stateRef.current.timerIn) {
          clearTimeout(stateRef.current.timerIn);
        }
        if (stateRef.current.timerOut) {
          clearTimeout(stateRef.current.timerOut);
        }

        stateRef.current.timerIn = setTimeout(function () {
          rectangle.style.zIndex = '2';
          stateRef.current.timerOut = setTimeout(function () {
            rectangle.style.zIndex = '3';
          }, 500);
        }, 500);
      }
    };

    const playRightBlockAnimation = () => {
      if (!stateRef.current.isRight) {
        if (rightBlock) rightBlock.classList.add('active');
        if (leftBlock) leftBlock.classList.remove('active');
        stateRef.current.isLeft = false;
        stateRef.current.isRight = true;
        playCircleAnimation();
        playLoopAnimation();
        playBgAnimation();
      }
    };

    const playLeftBlockAnimation = () => {
      stateRef.current.isRight = false;
      if (leftBlock) leftBlock.classList.add('active');
      if (rightBlock) rightBlock.classList.remove('active');
      if (!stateRef.current.isLeft) {
        stateRef.current.isLeft = true;
        playLoopAnimation();
        playCircleAnimation();
        playBgAnimation();
      }
    };

    // Add event listeners
    const leftIndicator = leftIndicatorRef.current;
    const rightIndicator = rightIndicatorRef.current;

    if (!isTouchDevice) {
      if (leftIndicator) {
        leftIndicator.addEventListener('mouseenter', playLeftBlockAnimation);
      }
      if (rightIndicator) {
        rightIndicator.addEventListener('mouseenter', playRightBlockAnimation);
      }
    } else {
      if (leftIndicator) {
        leftIndicator.addEventListener('touchstart', playLeftBlockAnimation);
      }
      if (rightIndicator) {
        rightIndicator.addEventListener('touchstart', playRightBlockAnimation);
      }
    }

    setIsReady(true);

    // Cleanup
    return () => {
      if (leftIndicator) {
        leftIndicator.removeEventListener('mouseenter', playLeftBlockAnimation);
        leftIndicator.removeEventListener('touchstart', playLeftBlockAnimation);
      }
      if (rightIndicator) {
        rightIndicator.removeEventListener('mouseenter', playRightBlockAnimation);
        rightIndicator.removeEventListener('touchstart', playRightBlockAnimation);
      }
      if (stateRef.current.timerIn) {
        clearTimeout(stateRef.current.timerIn);
      }
      if (stateRef.current.timerOut) {
        clearTimeout(stateRef.current.timerOut);
      }
    };
  }, []);

  // Load Lottie script if not already loaded
  useEffect(() => {
    if (!(window as any).lottie) {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lottie-web/5.12.2/lottie.min.js';
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  return (
    <>
      <div ref={loaderRef} id="load" className="loader active">
        <span className="load">loading</span>
      </div>

      <section ref={heroSectionRef} id="hero" className="hero-section">
        <div id="animated-bg"></div>
        <div id="left-indicator" ref={leftIndicatorRef}></div>
        <div id="right-indicator" ref={rightIndicatorRef}></div>

        <div className="container hero-section__container">
          {/* Left Block */}
          <div id="left-block" ref={leftBlockRef} className="left-block active">
            <div className="text-wrap text-wrap-left">
              <h2 className="lbl-1">
                Customer alignment for today
                <span className="yellow">.</span>
              </h2>
            </div>

            <div id="circles"></div>

            <div className="circles-description">
              <p className="lbl-2 desc-left">Your Brand's Why.</p>
              <p className="lbl-2 desc-right">Your Customer's Why.</p>
            </div>

            <div className="button-wrap button-wrap-left">
              <div className="button-gradient yellow">
                <a href="#" className="hero-button">Learn More</a>
              </div>
            </div>
          </div>

          {/* Right Block */}
          <div id="right-block" ref={rightBlockRef} className="right-block">
            <div className="logo-wrap logo-wrap-right">
              <svg
                className="labs-circles"
                id="labs-circles"
                width="13px"
                height="11px"
                viewBox="0 0 13 11"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
              >
                <style>
                  {`
                    #left-circle {
                      animation: left-circle 1.5s cubic-bezier(0.57, 0, 0.3, 1) infinite;
                      transform-origin: 20% 50%;
                    }
                    #right-circle {
                      animation: right-circle 1.5s cubic-bezier(0.57, 0, 0.3, 1) 0.05s infinite;
                      transform-origin: 33% 56%;
                    }
                    @keyframes left-circle {
                      0% { transform: rotate(0); }
                      50% { transform: rotate(-180deg); }
                      100% { transform: rotate(0); }
                    }
                    @keyframes right-circle {
                      0% { transform: rotate(0); }
                      50% { transform: rotate(-155deg); }
                      100% { transform: rotate(0); }
                    }
                  `}
                </style>
                <g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                  <g id="Index_Loop" transform="translate(-1051.000000, -164.000000)">
                    <g id="Top" transform="translate(-1.000000, -7.000000)">
                      <g id="Page-1_inner" transform="translate(1006.000000, 171.000000)">
                        <g id="Group-2" transform="translate(46.000000, 0.000000)">
                          <circle id="Oval" fill="#F9B225" cx="3.5" cy="7.5" r="3.5"></circle>
                          <circle id="left-circle" fill="#F35C55" cx="8" cy="2" r="2"></circle>
                          <circle id="right-circle" fill="#ED0188" cx="11" cy="7" r="2"></circle>
                        </g>
                      </g>
                    </g>
                  </g>
                </g>
              </svg>
              <object
                className="labs-logo"
                data="https://s3-us-west-1.amazonaws.com/zajno-storage0/rocket-source/labs.svg"
                type="image/svg+xml"
              ></object>
            </div>

            <div className="text-wrap text-wrap-right">
              <h2 className="lbl-1">
                Innovation for Tomorrow
                <span className="red">.</span>
              </h2>
            </div>

            <div id="infinity" className="infinity">
              <div id="trident" className="trident-mask"></div>
              <svg id="mask" width="431" height="195" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <clipPath id="myClip">
                    <rect
                      style={{
                        transform: 'rotate(-45deg)',
                        transformOrigin: 'center',
                      }}
                      x="207.5"
                      y="83"
                      width="19"
                      height="27"
                    />
                  </clipPath>
                  <clipPath id="y-shape" clipPathUnits="objectBoundingBox">
                    <polygon points=".482558 .3836, .537282 .51000, .502641 .567359, .45700, .46350" />
                  </clipPath>
                  <linearGradient
                    id="SVG"
                    gradientUnits="userSpaceOnUse"
                    x1="2.2678"
                    y1="103.6775"
                    x2="330.9431"
                    y2="94.3244"
                    gradientTransform="matrix(1 0 0 -1 0 192.6)"
                  >
                    <stop offset="0" style={{ stopColor: '#F9B224' }} />
                    <stop offset="0.1468" style={{ stopColor: '#F9B224' }} />
                    <stop offset="0.6142" style={{ stopColor: '#F35A56' }} />
                    <stop offset="1" style={{ stopColor: '#ED0288' }} />
                  </linearGradient>
                </defs>
                <rect
                  id="mask-rect"
                  fill="url(#SVG)"
                  x="0"
                  y="0"
                  width="431"
                  height="195"
                  clipPath="url(#myClip)"
                />
              </svg>
              <div id="loop"></div>
              <object
                className="infinity-sign"
                data="https://s3-us-west-1.amazonaws.com/zajno-storage0/rocket-source/infinity.svg"
                type="image/svg+xml"
              ></object>
            </div>

            <div className="button-wrap button-wrap-right">
              <div className="button-gradient red">
                <a href="#" className="hero-button">Learn More</a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default HeroSectionAnimated;
