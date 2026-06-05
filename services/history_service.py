from models import BlockchainTransaction


def get_all_transactions(
        db):

    return db.query(
        BlockchainTransaction
    ).all()