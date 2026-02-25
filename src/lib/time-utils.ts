export function formatTimeAgo(date: Date | string, locale: string = 'es') {
    const now = new Date()
    const diff = now.getTime() - new Date(date).getTime()
    const seconds = Math.floor(diff / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)

    const labels = {
        es: {
            now: 'hace un momento',
            minutes: (n: number) => `hace ${n} min`,
            hours: (n: number) => `hace ${n} h`,
            days: (n: number) => `hace ${n} d`,
            prefix: 'hace'
        },
        en: {
            now: 'just now',
            minutes: (n: number) => `${n}m ago`,
            hours: (n: number) => `${n}h ago`,
            days: (n: number) => `${n}d ago`,
            prefix: ''
        }
    }

    const l = (labels as any)[locale] || labels.es

    if (seconds < 60) return l.now
    if (minutes < 60) return l.minutes(minutes)
    if (hours < 24) return l.hours(hours)
    return l.days(days)
}
