import { useEffect, useMemo, useRef, useState } from 'react'
import type { KeyboardEvent as ReactKeyboardEvent } from 'react'
import { cn } from '../lib/utils'

type Option = {
  value: string
  label: string
}

type Props = {
  label: string
  value: string
  options: Option[]
  onChange: (value: string) => void
}

export function SelectMenu({ label, value, options, onChange }: Props) {
  const [open, setOpen] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState(0)
  const rootRef = useRef<HTMLDivElement>(null)
  const optionRefs = useRef<Array<HTMLButtonElement | null>>([])

  const selectedIndex = useMemo(
    () => Math.max(0, options.findIndex((option) => option.value === value)),
    [options, value],
  )

  const selectedLabel = useMemo(
    () => options.find((option) => option.value === value)?.label ?? value,
    [options, value],
  )

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false)
    }
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    window.addEventListener('mousedown', handleClickOutside)
    window.addEventListener('keydown', handleEscape)
    return () => {
      window.removeEventListener('mousedown', handleClickOutside)
      window.removeEventListener('keydown', handleEscape)
    }
  }, [])

  useEffect(() => {
    if (!open) return
    setHighlightedIndex(selectedIndex)
  }, [open, selectedIndex])

  useEffect(() => {
    if (!open) return
    optionRefs.current[highlightedIndex]?.focus()
  }, [highlightedIndex, open])

  function selectOptionAt(index: number) {
    const option = options[index]
    if (!option) return
    onChange(option.value)
    setOpen(false)
  }

  function onTriggerKeyDown(event: ReactKeyboardEvent<HTMLButtonElement>) {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault()
      setOpen(true)
      setHighlightedIndex(event.key === 'ArrowDown' ? selectedIndex : selectedIndex)
      return
    }
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      setOpen((prev) => !prev)
    }
  }

  function onOptionKeyDown(event: ReactKeyboardEvent<HTMLButtonElement>, index: number) {
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setHighlightedIndex((index + 1) % options.length)
      return
    }
    if (event.key === 'ArrowUp') {
      event.preventDefault()
      setHighlightedIndex((index - 1 + options.length) % options.length)
      return
    }
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      selectOptionAt(index)
      return
    }
    if (event.key === 'Tab') {
      setOpen(false)
    }
  }

  return (
    <div className="select-root" ref={rootRef}>
      <span className="select-label">{label}</span>
      <div className="select-control">
        <button
          type="button"
          className="ui-btn select-trigger"
          onClick={() => setOpen((prev) => !prev)}
          onKeyDown={onTriggerKeyDown}
          aria-haspopup="listbox"
          aria-expanded={open}
        >
          <span className="select-trigger-text">{selectedLabel}</span>
          <span
            className={cn('select-chevron', open ? 'rotate-[225deg]' : 'rotate-45')}
            aria-hidden="true"
          />
        </button>
        {open && (
          <div className="select-options" role="listbox" aria-label={label}>
            {options.map((option, index) => (
              <button
                type="button"
                key={option.value}
                ref={(element) => {
                  optionRefs.current[index] = element
                }}
                className={cn(
                  'select-option',
                  option.value === value && 'select-option-active',
                  index === highlightedIndex && 'select-option-highlighted',
                )}
                onMouseEnter={() => setHighlightedIndex(index)}
                onClick={() => {
                  selectOptionAt(index)
                }}
                onKeyDown={(event) => onOptionKeyDown(event, index)}
              >
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
