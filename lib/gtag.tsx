export const GA_ID = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID || ''

export const existsGaId = GA_ID !== ''

type ClickEvent = {
  action: 'click'
  category: 'sp_confirm_submit'
}

export type Event = (ClickEvent) & {
  label?: Record<string, string | number | boolean>
  value?: string
}

export const pageview = (path: string) => {
  if (!existsGaId) {
    return
  }

  window.gtag('config', GA_ID, {
    page_path: path,
  })
}

export const event = ({ action, category, label, value = '' }: Event) => {
  if (!existsGaId) {
    return
  }

  window.gtag('event', action, {
    event_category: category,
    event_label: label ? JSON.stringify(label) : '',
    value,
  })
}

export const GoogleAnalytics = () => (
  <>
    {existsGaId && (
      <>
        <script defer src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} />
        <script
          dangerouslySetInnerHTML={{
            __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_ID}', {
              page_path: window.location.pathname,
            });`,
          }}
        />
      </>
    )}
  </>
)
