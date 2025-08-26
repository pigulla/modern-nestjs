export const AUDIO_FORMAT = {
  MP3_320: 'mp3-320',
  AAC_64: 'aac-64',
  AAC_128: 'aac-128',
} as const

export type AudioFormat = (typeof AUDIO_FORMAT)[keyof typeof AUDIO_FORMAT]
