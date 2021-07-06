"""Add user expiration date

Revision ID: 84bda9d816c6
Revises: fb0304aeca6c
Create Date: 2021-06-15 18:06:20.362140

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '84bda9d816c6'
down_revision = 'e9b7657f6be1'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column(
        'invitations', sa.Column('user_expiration_date', sa.DateTime(), nullable=True)
    )
    op.add_column('users', sa.Column('expiration_date', sa.DateTime(), nullable=True))
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('users', 'expiration_date')
    op.drop_column('invitations', 'user_expiration_date')
    # ### end Alembic commands ###
