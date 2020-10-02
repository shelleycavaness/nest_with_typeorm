import { Get, Post, Body, Put, Delete, Logger, Param, Controller,  } from '@nestjs/common';
import { Request } from 'express';
import { DefiService } from './defi.service';
import { ApiBearerAuth, ApiResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { DefiEntity } from './defi.entity';
import { CreateDefiDto, UpdateDefiDto } from './create-defi-dto'

@ApiBearerAuth()
@ApiTags('defi')
@Controller('defi')

export class DefiController {
  constructor(private readonly defiService: DefiService) {}

  //************* get all items *******************//
  @ApiOperation({ summary: 'Get all defi' })
  @ApiResponse({ status: 200, description: 'Return all defi.'})
  @ApiResponse({ status: 404, description: 'Not found'})
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @Get()
  async findAll(): Promise<DefiEntity[]> {
    return await this.defiService.findAll();
  }

  //**************create an item *******************//
  @ApiOperation({ summary: 'Create a defi' })
  @ApiResponse({ status: 200, description: 'posts defi.'})
  @ApiResponse({ status: 404, description: 'Not found'})
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @Post() //you must post a user object with your info inside
  async create(@Body('defi') defiData: CreateDefiDto) {
    return this.defiService.create(defiData);
  }

//**************update an item *******************//
  @ApiOperation({ description: 'Update defi', operationId: 'PUT /defi' })
  @ApiResponse({ status: 200, description: 'updated a defi by id.'})
  @ApiResponse({ status: 404, description: 'Not found'})
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @Put('/:id')
  async update(@Param('id') id: number, @Body('defi') defiData: UpdateDefiDto) {
    // console.log('toto :>> has an email UserData', this);
    return await this.defiService.update(id, defiData);
  }

  //**************get an item by id *******************//
  @Get('/:id')
  async getDefi(id: number,): Promise<{ defi: DefiEntity }> {
    console.log('toto :>> has defiEntity', this, id);
    return await this.defiService.findDefi(id);
  }

}