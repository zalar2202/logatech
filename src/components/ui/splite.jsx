'use client'

import { useRef, useState, useEffect } from 'react'
import { Application } from '@splinetool/runtime'

export function SplineScene({ scene, className }) {
    const canvasRef = useRef(null)
    const appRef = useRef(null)
    const [loaded, setLoaded] = useState(false)
    const [error, setError] = useState(false)

    useEffect(() => {
        if (!canvasRef.current) return

        const app = new Application(canvasRef.current)
        appRef.current = app

        app.load(scene)
            .then(() => setLoaded(true))
            .catch(() => setError(true))

        return () => {
            try { app.dispose() } catch (_) {}
        }
    }, [scene])

    if (error) {
        return (
            <div className="w-full h-full flex items-center justify-center opacity-30">
                <div className="spline-loader" />
            </div>
        )
    }

    return (
        <div className="w-full h-full relative">
            {!loaded && (
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="spline-loader" />
                </div>
            )}
            <canvas
                ref={canvasRef}
                className={className}
                style={{ width: '100%', height: '100%' }}
            />
        </div>
    )
}
