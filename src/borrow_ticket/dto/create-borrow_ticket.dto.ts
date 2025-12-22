import { ApiProperty } from "@nestjs/swagger";
import { BorrowTicketStatus } from "../entities/borrow_ticket.entity";
import { IsDate, IsNumber, IsString } from "class-validator";

export class CreateBorrowTicketDto {
    @ApiProperty({
        example: '22520671',
        description: 'Student number of the borrower',
    })
    @IsNumber()
    student_code: number;

    @ApiProperty({
        example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
        description: 'Identifier of the user who creates the borrow ticket',
    })
    @IsString()
    create_by: string

    @ApiProperty({
        example: 'd4c3b2a1-6f5e-0987-dcba-654321fedcba',
        description: 'Identifier of the device being borrowed',
    })
    @IsString()
    device_id: string;

    @ApiProperty({
        example: 'e5f6a1b2-7890-cdef-ab12-34567890abcd',
        description: 'Identifier of the room where the device is located',
    })
    @IsString()
    room_id: string;

    @ApiProperty({
        example: 'BORROWING',
        description: 'Current status of the borrow ticket',
    })
    @IsString()
    status: BorrowTicketStatus;
}
