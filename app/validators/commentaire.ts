import vine from '@vinejs/vine'

export const createCommentaireValidator = vine.compile(
  vine.object({
    contenu: vine.string().trim().minLength(1).maxLength(1000),
  })
)