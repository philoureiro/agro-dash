import React from "react"
import { ZapidinhoButton, LoaderWrapper, ZapidinhoSpinner } from "./styles"

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text: string
  onClick?: () => void
  isLoading?: boolean
  style?: React.CSSProperties
}

export const Button = ({
  text,
  onClick,
  isLoading,
  disabled,
  style,
  ...rest
}: ButtonProps) => {
  return (
    <ZapidinhoButton
      type="button"
      loading={isLoading}
      className={isLoading ? "loading" : ""}
      onClick={onClick}
      disabled={disabled || isLoading}
      style={style}
      {...rest}
    >
      {isLoading ? (
        <LoaderWrapper>
          <ZapidinhoSpinner />
          <span style={{ marginLeft: 12 }}>Enviando...</span>
        </LoaderWrapper>
      ) : (
        text
      )}
    </ZapidinhoButton>
  )
}
