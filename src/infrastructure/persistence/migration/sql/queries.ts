import { queryFiles } from '../../query-files.js'

export const QUERY = queryFiles(import.meta.dirname, ['get-all-names'])
