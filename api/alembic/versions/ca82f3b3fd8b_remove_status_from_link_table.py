"""remove status from link table

Revision ID: ca82f3b3fd8b
Revises: 3db2d6be2e87
Create Date: 2025-01-12 00:30:01.756092

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'ca82f3b3fd8b'
down_revision: Union[str, None] = '3db2d6be2e87'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('link', 'status')
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('link', sa.Column('status', sa.VARCHAR(), autoincrement=False, nullable=True))
    # ### end Alembic commands ###
