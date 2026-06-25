export function sanitizeEmptyProps(obj){
    return Object.fromEntries(
        Object.entries(obj).filter(([key, value]) => {
            return !!value
        })
    )
}
