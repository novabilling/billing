# frozen_string_literal: true

module Novabilling
  module Webhooks
    module Types
      class WebhooksControllerPaystackRequest < Internal::Types::Model
        field :paystack_signature, -> { String }, optional: false, nullable: false, api_name: "x-paystack-signature"
      end
    end
  end
end
