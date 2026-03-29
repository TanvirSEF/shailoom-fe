"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useCartStore } from "@/store/use-cart-store"

export function FlyToCartAnimation({ id, image, startPos, onComplete }: { 
    id: number, 
    image: string, 
    startPos: { x: number; y: number; width: number; height: number },
    onComplete: () => void 
}) {
  const [targetPos, setTargetPos] = React.useState<{ x: number; y: number } | null>(null)

  React.useEffect(() => {
    const target = document.getElementById("cart-icon-nav")
    if (target) {
      const rect = target.getBoundingClientRect()
      setTargetPos({
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      })
    }
  }, [])

  if (!targetPos) return null

  return (
    <motion.div
      initial={{
        position: "fixed",
        top: startPos.y,
        left: startPos.x,
        width: startPos.width,
        height: startPos.height,
        zIndex: 9999,
        opacity: 0.8,
        borderRadius: "1rem",
        overflow: "hidden",
      }}
      animate={{
        top: targetPos.y - 20,
        left: targetPos.x - 20,
        width: 40,
        height: 40,
        opacity: 0,
        scale: 0.2,
      }}
      transition={{
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1],
      }}
      onAnimationComplete={onComplete}
      className="pointer-events-none border border-primary/50 bg-white shadow-2xl"
    >
      <img src={image} alt="Flying Product" className="h-full w-full object-cover" />
    </motion.div>
  )
}

export function AnimationPortal() {
    const animations = useCartStore((state) => state.animations)
    const removeAnimation = useCartStore((state) => state.removeAnimation)

    return (
        <AnimatePresence>
            {animations.map(anim => (
                <FlyToCartAnimation 
                    key={anim.id} 
                    id={anim.id}
                    image={anim.image} 
                    startPos={anim.rect} 
                    onComplete={() => removeAnimation(anim.id)}
                />
            ))}
        </AnimatePresence>
    )
}
