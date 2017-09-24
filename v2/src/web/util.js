export function getPageTitle(page) {
    let title = 'BSBLL'
    if (page) {
        title += ' | ' + page.toUpperCase();
    }
    return title
}