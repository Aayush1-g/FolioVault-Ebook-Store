export default function Field({
  label,
  type = 'text',
  value,
  onChange,
  error,
  placeholder,
  maxLength,
  autoComplete,
  hint,
}) {
  return (
    <div className="field">
      <label className="field-label">{label}</label>
      <input
        className={`field-input ${error ? 'input-error' : ''}`}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        maxLength={maxLength}
        autoComplete={autoComplete}
      />
      {hint && !error && <span className="field-hint">{hint}</span>}
      {error && <span className="field-error">{error}</span>}
    </div>
  )
}
