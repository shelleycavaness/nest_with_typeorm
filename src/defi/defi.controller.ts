import { Get, Post, Body, Put, Delete, Query, Logger, Param, Controller,  } from '@nestjs/common';
import { Request } from 'express';
import { DefiService } from './defi.service';
import { ApiBearerAuth, ApiResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { DefiEntity } from './defi.entity';
import { CreateDefiDto, UpdateDefiDto } from './create-defi-dto'
import { User } from '../user/user.decorator';


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
  //****rememeber that you have to send a defi object ***********///
  @ApiOperation({ summary: 'Create a defi object' })
  @ApiResponse({ status: 200, description: 'posts defi.'})
  @ApiResponse({ status: 404, description: 'Not found'})
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @Post() //you must post a user object with your info inside
  async create(@Body('defi') defiData: CreateDefiDto) {
    return this.defiService.create(defiData);
  }

//**************update an item *******************//
  @ApiOperation({ summary: 'Update defi', operationId: 'PUT /defi' })
  @ApiResponse({ status: 200, description: 'updated a defi by id.'})
  @ApiResponse({ status: 404, description: 'Not found'})
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @Put('/:id')
  async update(@Param('id') id: number, @Body('defi') defiData: UpdateDefiDto) {
   
    return await this.defiService.update(id, defiData);
  }

  //**************get an item by id *******************//
  @ApiOperation({ summary: 'find a defi by id' })
  @ApiResponse({ status: 200, description: 'updated a defi by id.'})
  @ApiResponse({ status: 500, description: 'Internal server error' })

  @Get('/:id')
  async getDefi(@Param('id') id: number): Promise<DefiEntity> {
   
    return await this.defiService.findDefi(id);
  }

  /**************    user has defi endpoints  ***************/
    /**********   get all defis by a user ************/

    @ApiOperation({ summary: 'Get all defi from a user' })
    @ApiResponse({ status: 200, description: 'Return users defi.'})
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    @Get('toto')
    async getUserFeed(@User('id') userId: number, @Query() query): Promise<DefiEntity[]> {
      return await this.defiService.findUserActions(1);
    }



}