import type { HttpContext } from '@adonisjs/core/http'
import Commentaire from '#models/commentaire'
import Livre from '#models/livre'
import { createCommentaireValidator } from '#validators/commentaire'

export default class CommentairesController {
	async index({ params, response }: HttpContext) {
		await Livre.findOrFail(params.id)

		const commentaires = await Commentaire.query()
			.where('livre_id', params.id)
			.preload('auteur', (userQuery) => {
				userQuery.select(['id', 'username'])
			})
			.orderBy('created_at', 'desc')

		return response.ok(commentaires)
	}

	async show({ params, response }: HttpContext) {
		const commentaire = await Commentaire.query()
			.where('id', params.commentId)
			.where('livre_id', params.id)
			.preload('auteur', (userQuery) => {
				userQuery.select(['id', 'username'])
			})
			.firstOrFail()

		return response.ok(commentaire)
	}

	async store({ params, request, response, auth }: HttpContext) {
		const { contenu } = await request.validateUsing(createCommentaireValidator)
		await Livre.findOrFail(params.id)

		try {
			await auth.authenticate()
		} catch {
			return response.unauthorized({
				message: 'Authentication required',
				error: 'No valid token provided',
			})
		}

		const commentaire = await Commentaire.create({
			contenu,
			livreId: Number(params.id),
			userId: auth.user!.id,
		})

		await commentaire.load('auteur', (userQuery) => {
			userQuery.select(['id', 'username'])
		})

		return response.created(commentaire)
	}

	async update({ params, request, response, auth }: HttpContext) {
		const { contenu } = await request.validateUsing(createCommentaireValidator)

		try {
			await auth.authenticate()
		} catch {
			return response.unauthorized({
				message: 'Authentication required',
				error: 'No valid token provided',
			})
		}

		const commentaire = await Commentaire.query()
			.where('id', params.commentId)
			.where('livre_id', params.id)
			.firstOrFail()

		const isOwner = commentaire.userId === auth.user!.id
		const isAdmin = auth.user!.admin === true

		if (!isOwner && !isAdmin) {
			return response.forbidden({ message: 'Not allowed to update this comment' })
		}

		commentaire.contenu = contenu
		await commentaire.save()

		await commentaire.load('auteur', (userQuery) => {
			userQuery.select(['id', 'username'])
		})

		return response.ok(commentaire)
	}

	async destroy({ params, response, auth }: HttpContext) {
		try {
			await auth.authenticate()
		} catch {
			return response.unauthorized({
				message: 'Authentication required',
				error: 'No valid token provided',
			})
		}

		const commentaire = await Commentaire.query()
			.where('id', params.commentId)
			.where('livre_id', params.id)
			.firstOrFail()

		const isOwner = commentaire.userId === auth.user!.id
		const isAdmin = auth.user!.admin === true

		if (!isOwner && !isAdmin) {
			return response.forbidden({ message: 'Not allowed to delete this comment' })
		}

		await commentaire.delete()
		return response.noContent()
	}
}
