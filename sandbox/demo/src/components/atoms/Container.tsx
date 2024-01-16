import { ElementProps } from "kaioken"

export function Container({
  className,
  children,
  ...props
}: ElementProps<"div">) {
  return (
    <div {...props} className={`container mx-auto px-4 ${className || ""}`}>
      {children}
    </div>
  )
}
