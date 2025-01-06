"""add expiration_date on link table

Revision ID: ba826fd381df
Revises: 757db8ffb2d8
Create Date: 2025-01-06 23:12:28.860261

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'ba826fd381df'
down_revision: Union[str, None] = '757db8ffb2d8'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('link', sa.Column('expiration_date', sa.DateTime(), nullable=True))
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('link', 'expiration_date')
    # ### end Alembic commands ###
