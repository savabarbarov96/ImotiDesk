import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCurrentTransition } from '../lib/animations/enhanced-page-transitions';

const TransitionsDemo = () => {
  const currentTransition = useCurrentTransition();

  const demoRoutes = [
    { path: '/about', label: 'About (Default Blur)', description: 'Default blur transition' },
    { path: '/properties', label: 'Properties (Scale)', description: 'Scale with blur effect' },
    { path: '/auth', label: 'Auth (Slide)', description: 'Slide up with blur' },
    { path: '/admin', label: 'Admin (Fade)', description: 'Simple fade with blur' },
    { path: '/news', label: 'News (Slide)', description: 'Slide transition' },
    { path: '/services', label: 'Services', description: 'Default transition' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Page Transitions Demo
          </h1>
          <p className="text-lg text-gray-600 mb-2">
            Click on any link to see the smooth page transitions with blur effects
          </p>
          <div className="inline-block bg-white rounded-lg px-4 py-2 shadow-sm border">
            <span className="text-sm font-medium text-gray-700">
              Current: {currentTransition.type} • {currentTransition.duration}s • {currentTransition.mode}
            </span>
          </div>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {demoRoutes.map((route, index) => (
            <motion.div
              key={route.path}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Link
                to={route.path}
                className="block bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md hover:border-gray-300 transition-all duration-300 group"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600">
                  {route.label}
                </h3>
                <p className="text-gray-600 text-sm">
                  {route.description}
                </p>
                <div className="mt-4 flex items-center text-blue-600 text-sm font-medium">
                  Try it out
                  <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-12 text-center"
        >
          <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Transition Effects Explained
            </h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 text-left">
              <div>
                <h3 className="font-medium text-gray-900 mb-1">Blur</h3>
                <p className="text-sm text-gray-600">Opacity + blur filter effect</p>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 mb-1">Scale</h3>
                <p className="text-sm text-gray-600">Scale + opacity + blur</p>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 mb-1">Slide</h3>
                <p className="text-sm text-gray-600">Vertical movement + blur</p>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 mb-1">Fade</h3>
                <p className="text-sm text-gray-600">Simple opacity + blur</p>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 mb-1">Default</h3>
                <p className="text-sm text-gray-600">Horizontal slide + scale + blur</p>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 mb-1">Mode</h3>
                <p className="text-sm text-gray-600">out-in: wait for exit before enter</p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="mt-8 text-center"
        >
          <Link
            to="/"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default TransitionsDemo; 