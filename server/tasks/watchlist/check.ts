const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export default defineTask({
  meta: {
    name: 'watchlist:check',
    description: 'Check Discogs marketplace for new listings on watched releases',
  },

  async run() {
    const watchlistItems = await prisma.watchlistItem.findMany({
      include: { user: true },
    })

    if (!watchlistItems.length) {
      return { result: 'No watchlist items to check' }
    }

    let notificationsCreated = 0

    for (const item of watchlistItems) {
      if (!item.user.discogsToken) continue

      try {
        const numForSale = await fetchDiscogsMarketplaceStats(
          item.discogsReleaseId,
          item.user.discogsToken
        )

        if (numForSale > item.availableCount) {
          await prisma.notification.create({
            data: {
              userId: item.userId,
              message: `${numForSale} copies of "${item.title}" by ${item.artist} are now available on Discogs marketplace.`,
            },
          })
          notificationsCreated++
        }

        await prisma.watchlistItem.update({
          where: { id: item.id },
          data: {
            availableCount: numForSale,
            lastCheckedAt: new Date(),
          },
        })
      } catch (e) {
        console.error(`Failed to check watchlist item ${item.id}:`, e)
      }

      await sleep(1100)
    }

    return {
      result: `Checked ${watchlistItems.length} items, created ${notificationsCreated} notifications`,
    }
  },
})
