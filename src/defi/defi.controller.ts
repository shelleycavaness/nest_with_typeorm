import { Get, Post, Body, Put, Delete, Param, Controller, UsePipes } from '@nestjs/common';
import { Request } from 'express';
import { DefiService } from './defi.service';

import { HttpException } from '@nestjs/common/exceptions/http.exception';
import { User } from '../user.decorator';
import { ValidationPipe } from '../shared/pipes/validation.pipe';

exports class DefiController {

}