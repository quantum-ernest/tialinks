"""update utm table

Revision ID: 31a2f63504c7
Revises: a0a3a775adde
Create Date: 2025-01-07 15:23:40.709286

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '31a2f63504c7'
down_revision: Union[str, None] = 'a0a3a775adde'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.alter_column('utm', 'source',
               existing_type=sa.VARCHAR(),
               nullable=True)
    op.drop_constraint('utm_campaign_source_user_id_key', 'utm', type_='unique')
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_unique_constraint('utm_campaign_source_user_id_key', 'utm', ['campaign', 'source', 'user_id'])
    op.alter_column('utm', 'source',
               existing_type=sa.VARCHAR(),
               nullable=False)
    # ### end Alembic commands ###
