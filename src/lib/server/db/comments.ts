import prisma from '../prisma';

export async function createComment(authorId: string, moduleId: string, content: string) {
	return prisma.comment.create({ data: { authorId, moduleId, content } });
}

export async function getUserInstall(userId: string, moduleId: string) {
	return prisma.moduleInstall.findUnique({ where: { userId_moduleId: { userId, moduleId } } });
}

export async function upsertInstall(userId: string, moduleId: string) {
	return prisma.moduleInstall.upsert({
		where: { userId_moduleId: { userId, moduleId } },
		create: { userId, moduleId },
		update: {},
	});
}
