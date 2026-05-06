import vine from '@vinejs/vine'

export const createLivreValidator = vine.compile(
  vine.object({
    userId: vine.number().positive().optional(),
    titre: vine.string().trim().minLength(2),
    auteur: vine.string().trim(),
    categorie: vine.string().trim(),
    editeur: vine.string().trim(),
    // epub: vine.string().trim(),
    resume: vine.string().trim().optional(),
    nbPages: vine.number().positive().optional(),
    extraitPdf: vine.string().optional(),
    imageCouverture: vine.string().optional(),
  })
)

export const updateLivreValidator = vine.compile(
  vine.object({
    titre: vine.string().trim().minLength(2).optional(),
    auteur: vine.string().trim().optional(),
    categorie: vine.string().trim().optional(),
    editeur: vine.string().trim().optional(),
    // epub: vine.string().trim().optional(),
    resume: vine.string().trim().optional(),
    nbPages: vine.number().positive().optional(),
  })
)
