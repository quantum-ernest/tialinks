"""update click table

Revision ID: eb92dd5d9a51
Revises: f661277fe815
Create Date: 2024-12-20 13:54:12.831057

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'eb92dd5d9a51'
down_revision: Union[str, None] = 'f661277fe815'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.alter_column('click', 'user_agent_id',
               existing_type=sa.INTEGER(),
               nullable=True)
    op.alter_column('click', 'location_id',
               existing_type=sa.INTEGER(),
               nullable=True)
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.alter_column('click', 'location_id',
               existing_type=sa.INTEGER(),
               nullable=False)
    op.alter_column('click', 'user_agent_id',
               existing_type=sa.INTEGER(),
               nullable=False)
    # ### end Alembic commands ###