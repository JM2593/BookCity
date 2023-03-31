import React, { useEffect, useLayoutEffect } from 'react'

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;  // 没有window说明是ssr

export default useIsomorphicLayoutEffect