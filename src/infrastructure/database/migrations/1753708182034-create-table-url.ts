import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from 'typeorm';

export class CreateTableUrl1753708182034 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'url',
                columns: [
                    {
                        name: 'id',
                        type: 'uuid',
                        isPrimary: true,
                        generationStrategy: 'uuid',
                        default: 'uuid_generate_v4()'
                    },
                    {
                        name: 'shortCode',
                        type: 'varchar',
                        length: '6',
                        isUnique: true,
                        isNullable: false
                    },
                    {
                        name: 'originalUrl',
                        type: 'text',
                        isNullable: false
                    },
                    {
                        name: 'accessCount',
                        type: 'integer',
                        isNullable: false,
                        default: 0
                    },
                    {
                        name: 'userId',
                        type: 'uuid',
                        isNullable: true
                    },
                    {
                        name: 'createdAt',
                        type: 'timestamp with time zone',
                        default: 'now()'
                    },
                    {
                        name: 'updatedAt',
                        type: 'timestamp with time zone',
                        default: 'now()'
                    },
                    {
                        name: 'deletedAt',
                        type: 'timestamp with time zone',
                        isNullable: true
                    }
                ]
            }),
            true
        );

        await queryRunner.createIndex(
            'url',
            new TableIndex({
                name: 'IDX_URL_SHORT_CODE',
                columnNames: ['shortCode'],
                isUnique: true
            })
        );

        await queryRunner.createIndex(
            'url',
            new TableIndex({
                name: 'IDX_URL_ORIGINAL_URL',
                columnNames: ['originalUrl'],
                isUnique: false
            })
        );

        await queryRunner.createForeignKey(
            'url',
            new TableForeignKey({
                columnNames: ['userId'],
                referencedColumnNames: ['id'],
                referencedTableName: 'user',
                onDelete: 'SET NULL',
                onUpdate: 'CASCADE'
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {}
}
