<?php

require 'core/Security.php';

use \core\Security;

echo Security::hashString('ajax2000', Security::getPasswordAlgorithm());
                