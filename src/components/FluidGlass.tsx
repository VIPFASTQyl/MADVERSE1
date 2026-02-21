/* eslint-disable react/no-unknown-property */
import * as THREE from 'three';
import { useRef, useState, useEffect, memo, ReactNode, Suspense } from 'react';
import { Canvas, createPortal, useFrame, useThree, ThreeElements } from '@react-three/fiber';
import {
  useFBO,
  useScroll,
  Image,
  Scroll,
  ScrollControls,
  Text
} from '@react-three/drei';
import { easing } from 'maath';

type Mode = 'lens' | 'bar' | 'cube';

interface NavItem {
  label: string;
  link: string;
}

type ModeProps = Record<string, unknown>;

interface FluidGlassProps {
  mode?: Mode;
  lensProps?: ModeProps;
  barProps?: ModeProps;
  cubeProps?: ModeProps;
}

export default function FluidGlass({ mode = 'lens', lensProps = {}, barProps = {}, cubeProps = {} }: FluidGlassProps) {
  const Wrapper = mode === 'bar' ? Bar : mode === 'cube' ? Cube : Lens;
  const rawOverrides = mode === 'bar' ? barProps : mode === 'cube' ? cubeProps : lensProps;

  const {
    navItems = [
      { label: 'Home', link: '' },
      { label: 'About', link: '' },
      { label: 'Contact', link: '' }
    ],
    ...modeProps
  } = rawOverrides;

  return (
    <Suspense fallback={<div style={{ width: '100%', height: '100%', background: '#000' }} />}>
      <Canvas camera={{ position: [0, 0, 20], fov: 15 }} gl={{ alpha: true, antialias: true }}>
        <ScrollControls damping={0.2} pages={3} distance={0.4}>
          {mode === 'bar' && <NavItems items={navItems as NavItem[]} />}
          <Wrapper modeProps={modeProps}>
            <Scroll>
              <Typography />
              <Images />
            </Scroll>
            <Scroll html />
          </Wrapper>
        </ScrollControls>
      </Canvas>
    </Suspense>
  );
}

type MeshProps = ThreeElements['mesh'];

interface ModeWrapperProps extends MeshProps {
  children?: ReactNode;
  geometryKey: string;
  lockToBottom?: boolean;
  followPointer?: boolean;
  modeProps?: ModeProps;
  geometryType?: 'cylinder' | 'box' | 'sphere';
}

const ModeWrapper = memo(function ModeWrapper({
  children,
  geometryKey,
  lockToBottom = false,
  followPointer = true,
  modeProps = {},
  geometryType = 'cylinder',
  ...props
}: ModeWrapperProps) {
  const ref = useRef<THREE.Mesh>(null!);
  const buffer = useFBO();
  const { viewport: vp } = useThree();
  const [scene] = useState<THREE.Scene>(() => new THREE.Scene());
  const geoWidthRef = useRef<number>(1);

  const getGeometry = () => {
    switch (geometryType) {
      case 'box':
        return new THREE.BoxGeometry(1, 1, 1);
      case 'sphere':
        return new THREE.SphereGeometry(0.5, 32, 32);
      case 'cylinder':
      default:
        return new THREE.CylinderGeometry(0.5, 0.5, 1, 32);
    }
  };

  useEffect(() => {
    const geo = getGeometry();
    geo.computeBoundingBox();
    if (geo.boundingBox) {
      geoWidthRef.current = geo.boundingBox.max.x - geo.boundingBox.min.x || 1;
    }
  }, [geometryType]);

  useFrame((state, delta) => {
    try {
      const { gl, viewport, pointer, camera } = state;
      const v = viewport.getCurrentViewport(camera, [0, 0, 15]);

      const destX = followPointer ? (pointer.x * v.width) / 2 : 0;
      const destY = lockToBottom ? -v.height / 2 + 0.2 : followPointer ? (pointer.y * v.height) / 2 : 0;
      easing.damp3(ref.current.position, [destX, destY, 15], 0.15, delta);

      if ((modeProps as { scale?: number }).scale == null) {
        const maxWorld = v.width * 0.9;
        const desired = maxWorld / geoWidthRef.current;
        ref.current.scale.setScalar(Math.min(0.15, desired));
      }

      gl.setRenderTarget(buffer);
      gl.render(scene, camera);
      gl.setRenderTarget(null);
    } catch (e) {
      console.error('Error in ModeWrapper useFrame:', e);
    }
  });

  const { scale, ...materialProps } = modeProps as {
    scale?: number;
    [key: string]: unknown;
  };

  return (
    <>
      {createPortal(children, scene)}
      <mesh scale={[vp.width, vp.height, 1]}>
        <planeGeometry />
        <meshBasicMaterial color="#000" transparent />
      </mesh>
      <mesh
        ref={ref}
        scale={scale ?? 0.15}
        rotation-x={Math.PI / 2}
        geometry={getGeometry()}
        {...props}
      >
        <meshStandardMaterial
          color="#4488ff"
          metalness={0.8}
          roughness={0.2}
          emissive="#2244ff"
          emissiveIntensity={0.5}
        />
      </mesh>
    </>
  );
});

function Lens({ modeProps, ...p }: { modeProps?: ModeProps } & MeshProps) {
  return <ModeWrapper geometryKey="Cylinder" geometryType="cylinder" followPointer modeProps={modeProps} {...p} />;
}

function Cube({ modeProps, ...p }: { modeProps?: ModeProps } & MeshProps) {
  return <ModeWrapper geometryKey="Cube" geometryType="box" followPointer modeProps={modeProps} {...p} />;
}

function Bar({ modeProps = {}, ...p }: { modeProps?: ModeProps } & MeshProps) {
  return (
    <ModeWrapper
      geometryKey="Cube"
      geometryType="box"
      lockToBottom
      followPointer={false}
      modeProps={modeProps}
      {...p}
    />
  );
}

function NavItems({ items }: { items: NavItem[] }) {
  const group = useRef<THREE.Group>(null!);
  const { viewport, camera } = useThree();

  const DEVICE = {
    mobile: { max: 639, spacing: 0.2, fontSize: 0.035 },
    tablet: { max: 1023, spacing: 0.24, fontSize: 0.045 },
    desktop: { max: Infinity, spacing: 0.3, fontSize: 0.045 }
  };
  const getDevice = () => {
    const w = window.innerWidth;
    return w <= DEVICE.mobile.max ? 'mobile' : w <= DEVICE.tablet.max ? 'tablet' : 'desktop';
  };

  const [device, setDevice] = useState<keyof typeof DEVICE>(getDevice());

  useEffect(() => {
    const onResize = () => setDevice(getDevice());
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const { spacing, fontSize } = DEVICE[device];

  useFrame(() => {
    if (!group.current) return;
    const v = viewport.getCurrentViewport(camera, [0, 0, 15]);
    group.current.position.set(0, -v.height / 2 + 0.2, 15.1);

    group.current.children.forEach((child, i) => {
      child.position.x = (i - (items.length - 1) / 2) * spacing;
    });
  });

  const handleNavigate = (link: string) => {
    if (!link) return;
    link.startsWith('#') ? (window.location.hash = link) : (window.location.href = link);
  };

  return (
    <group ref={group} renderOrder={10}>
      {items.map(({ label, link }) => (
        <Text
          key={label}
          fontSize={fontSize}
          color="white"
          anchorX="center"
          anchorY="middle"
          renderOrder={10}
          onClick={e => {
            e.stopPropagation();
            handleNavigate(link);
          }}
          onPointerOver={() => (document.body.style.cursor = 'pointer')}
          onPointerOut={() => (document.body.style.cursor = 'auto')}
        >
          {label}
        </Text>
      ))}
    </group>
  );
}

// Generate placeholder images as data URLs
const generatePlaceholderImage = (color: string, text: string): string => {
  try {
    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 600;
    const ctx = canvas.getContext('2d');
    if (!ctx) return '';

    ctx.fillStyle = color;
    ctx.fillRect(0, 0, 800, 600);

    ctx.fillStyle = 'white';
    ctx.font = 'bold 48px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, 400, 300);

    return canvas.toDataURL('image/png');
  } catch (e) {
    console.error('Error generating placeholder:', e);
    return '';
  }
};

function Images() {
  const group = useRef<THREE.Group>(null!);
  const data = useScroll();
  const { height } = useThree(s => s.viewport);

  useFrame(() => {
    if (!group.current || !group.current.children) return;
    try {
      const children = group.current.children as any[];
      if (children[0]?.material?.zoom != null) children[0].material.zoom = 1 + data.range(0, 1 / 3) / 3;
      if (children[1]?.material?.zoom != null) children[1].material.zoom = 1 + data.range(0, 1 / 3) / 3;
      if (children[2]?.material?.zoom != null) children[2].material.zoom = 1 + data.range(1.15 / 3, 1 / 3) / 2;
      if (children[3]?.material?.zoom != null) children[3].material.zoom = 1 + data.range(1.15 / 3, 1 / 3) / 2;
      if (children[4]?.material?.zoom != null) children[4].material.zoom = 1 + data.range(1.15 / 3, 1 / 3) / 2;
    } catch (e) {
      // silently fail
    }
  });

  const img1 = generatePlaceholderImage('#00CED1', 'Youth');
  const img2 = generatePlaceholderImage('#AFEEEE', 'Programs');
  const img3 = generatePlaceholderImage('#00BCD4', 'Growth');

  return (
    <group ref={group}>
      {img1 && <Image position={[-2, 0, 0]} scale={[3, height / 1.1]} url={img1} />}
      {img2 && <Image position={[2, 0, 3]} scale={3} url={img2} />}
      {img3 && <Image position={[-2.05, -height, 6]} scale={[1, 3]} url={img3} />}
      {img1 && <Image position={[-0.6, -height, 9]} scale={[1, 2]} url={img1} />}
      {img2 && <Image position={[0.75, -height, 10.5]} scale={1.5} url={img2} />}
    </group>
  );
}

function Typography() {
  const DEVICE = {
    mobile: { fontSize: 0.2 },
    tablet: { fontSize: 0.4 },
    desktop: { fontSize: 0.6 }
  };
  const getDevice = () => {
    const w = window.innerWidth;
    return w <= 639 ? 'mobile' : w <= 1023 ? 'tablet' : 'desktop';
  };

  const [device, setDevice] = useState<keyof typeof DEVICE>(getDevice());

  useEffect(() => {
    const onResize = () => setDevice(getDevice());
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const { fontSize } = DEVICE[device];

  return (
    <Text
      position={[0, 0, 12]}
      fontSize={fontSize}
      letterSpacing={-0.05}
      color="white"
      anchorX="center"
      anchorY="middle"
    >
      Youth Programs
    </Text>
  );
}
