import { BaseText } from './ui/Typography'

type ReportFooterProps = {
  footerText: string
  pageLabel: string
}

function ReportFooter({ footerText, pageLabel }: ReportFooterProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 border-t border-border pt-4">
      <BaseText variant="caption" className="text-foreground-muted">
        {footerText}
      </BaseText>
      <BaseText variant="caption" className="text-foreground-muted">
        {pageLabel}
      </BaseText>
    </div>
  )
}

export default ReportFooter
